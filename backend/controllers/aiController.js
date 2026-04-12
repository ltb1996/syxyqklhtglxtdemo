const Student = require('../models/Student');

/**
 * AI 问答控制器
 * 使用阿里通义千问 API（DashScope OpenAI 兼容模式）
 */

// 获取学生数据摘要，作为 AI 上下文
const getDataContext = async () => {
  const total = await Student.countDocuments();
  const byGender = await Student.aggregate([
    { $group: { _id: '$gender', count: { $sum: 1 } } }
  ]);
  const byCollege = await Student.aggregate([
    { $group: { _id: '$college', count: { $sum: 1 } } }
  ]);
  const byGrade = await Student.aggregate([
    { $group: { _id: '$grade', count: { $sum: 1 } } }
  ]);
  const byDegree = await Student.aggregate([
    { $group: { _id: '$degree', count: { $sum: 1 } } }
  ]);
  const byStatus = await Student.aggregate([
    { $group: { _id: '$status', count: { $sum: 1 } } }
  ]);
  const byPolitical = await Student.aggregate([
    { $group: { _id: '$politicalStatus', count: { $sum: 1 } } }
  ]);
  const gpaStats = await Student.aggregate([
    {
      $group: {
        _id: null,
        avgGpa: { $avg: '$academicInfo.gpa' },
        maxGpa: { $max: '$academicInfo.gpa' },
        minGpa: { $min: '$academicInfo.gpa' }
      }
    }
  ]);
  const collegeGpa = await Student.aggregate([
    {
      $group: {
        _id: '$college',
        avgGpa: { $avg: '$academicInfo.gpa' },
        count: { $sum: 1 }
      }
    }
  ]);
  const lowGpaStudents = await Student.find(
    { 'academicInfo.gpa': { $lt: 2.0, $exists: true } },
    'name studentId college grade academicInfo.gpa'
  ).lean();
  const scholarshipStudents = await Student.find(
    { 'academicInfo.scholarships.0': { $exists: true } },
    'name studentId college academicInfo.scholarships'
  ).lean();
  const allStudents = await Student.find(
    {},
    'name studentId gender college major grade degree status academicInfo.gpa academicInfo.rank academicInfo.totalStudents politicalStatus'
  ).lean();

  return `
当前系统中的学生数据摘要：
- 学生总数：${total} 人
- 性别分布：${byGender.map(g => `${g._id} ${g.count}人`).join('、')}
- 学院分布：${byCollege.map(c => `${c._id} ${c.count}人`).join('、')}
- 年级分布：${byGrade.map(g => `${g._id} ${g.count}人`).join('、')}
- 学历分布：${byDegree.map(d => `${d._id} ${d.count}人`).join('、')}
- 状态分布：${byStatus.map(s => `${s._id} ${s.count}人`).join('、')}
- 政治面貌分布：${byPolitical.map(p => `${p._id} ${p.count}人`).join('、')}
- GPA 统计：平均 ${gpaStats[0]?.avgGpa?.toFixed(2) || '无数据'}，最高 ${gpaStats[0]?.maxGpa?.toFixed(2) || '无数据'}，最低 ${gpaStats[0]?.minGpa?.toFixed(2) || '无数据'}
- 各学院平均 GPA：${collegeGpa.map(c => `${c._id} 平均${c.avgGpa?.toFixed(2)}`).join('、')}
- GPA 低于 2.0 的预警学生：${lowGpaStudents.length > 0 ? lowGpaStudents.map(s => `${s.name}(${s.studentId}, ${s.college}, GPA:${s.academicInfo?.gpa})`).join('、') : '无'}
- 获得奖学金的学生：${scholarshipStudents.length > 0 ? scholarshipStudents.map(s => `${s.name}(${s.studentId}, 奖学金:${s.academicInfo.scholarships.map(sc => sc.name).join('/')})`).join('、') : '无'}

全部学生详情：
${allStudents.map(s => `${s.name} | 学号:${s.studentId} | ${s.gender} | ${s.college} | ${s.major} | ${s.grade} | ${s.degree} | 状态:${s.status} | GPA:${s.academicInfo?.gpa || '无'} | 排名:${s.academicInfo?.rank || '无'}/${s.academicInfo?.totalStudents || '无'} | ${s.politicalStatus || '未知'}`).join('\n')}
`.trim();
};

// AI 聊天接口
const chat = async (req, res) => {
  try {
    const { message, history = [] } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({
        success: false,
        message: '请输入问题'
      });
    }

    const apiKey = process.env.DASHSCOPE_API_KEY;
    if (!apiKey) {
      return res.status(500).json({
        success: false,
        message: 'AI 服务未配置，请在 .env 中设置 DASHSCOPE_API_KEY'
      });
    }

    // 获取学生数据上下文
    const dataContext = await getDataContext();

    const systemPrompt = `你是一个学生信息管理系统的 AI 助手。你可以根据系统中的真实学生数据回答用户的问题，提供数据分析、趋势洞察和建议。

以下是系统当前的学生数据：
${dataContext}

请注意：
1. 基于以上真实数据回答问题，不要编造数据
2. 回答要简洁明了，使用中文
3. 如果涉及到数据分析，可以给出具体的数字和百分比
4. 可以提供有建设性的分析建议
5. 如果问题与学生数据无关，礼貌地引导用户提问相关问题`;

    // 构建消息列表
    const messages = [
      { role: 'system', content: systemPrompt },
      ...history.slice(-10).map(h => ({
        role: h.role,
        content: h.content
      })),
      { role: 'user', content: message }
    ];

    // 调用阿里 DashScope API（OpenAI 兼容模式）
    const response = await fetch('https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: process.env.DASHSCOPE_MODEL || 'qwen-plus',
        messages,
        temperature: 0.7,
        max_tokens: 1024
      })
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('DashScope API error:', response.status, errorData);
      return res.status(500).json({
        success: false,
        message: 'AI 服务调用失败，请检查 API Key 是否正确'
      });
    }

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content || '抱歉，我无法生成回答。';

    res.json({
      success: true,
      data: {
        reply,
        usage: data.usage
      }
    });
  } catch (error) {
    console.error('AI chat error:', error);
    res.status(500).json({
      success: false,
      message: 'AI 服务异常：' + error.message
    });
  }
};

module.exports = { chat };
