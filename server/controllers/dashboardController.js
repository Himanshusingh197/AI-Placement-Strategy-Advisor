const Profile = require('../models/Profile');
const Resume = require('../models/Resume');
const SkillAnalysis = require('../models/SkillAnalysis');
const Roadmap = require('../models/Roadmap');
const Interview = require('../models/Interview');
const CareerRecommendation = require('../models/CareerRecommendation');

// @desc    Get dashboard data
// @route   GET /api/dashboard
const getDashboardData = async (req, res) => {
  try {
    const userId = req.user.id;

    const [profile, resume, skillAnalysis, roadmap, interviews, careerRec] = await Promise.all([
      Profile.findOne({ userId }),
      Resume.findOne({ userId }).select('-extractedText -filePath'),
      SkillAnalysis.findOne({ userId }),
      Roadmap.findOne({ userId }),
      Interview.find({ userId, status: 'completed' }).sort({ completedAt: -1 }).limit(5),
      CareerRecommendation.findOne({ userId })
    ]);

    // Calculate placement readiness scores
    const resumeScore = resume?.analysis?.score || 0;
    const technicalScore = skillAnalysis
      ? Math.max(0, 100 - (skillAnalysis.overallGapScore || 0))
      : 0;
    const roadmapProgress = roadmap?.totalProgress || 0;
    const interviewScore = interviews.length > 0
      ? Math.round(interviews.reduce((sum, i) => sum + (i.scores?.overall || 0), 0) / interviews.length)
      : 0;
    const profileScore = profile?.completionScore || 0;

    const overallReadiness = Math.round(
      (resumeScore * 0.25) +
      (technicalScore * 0.30) +
      (roadmapProgress * 0.20) +
      (interviewScore * 0.15) +
      (profileScore * 0.10)
    );

    // Generate next action recommendation
    let nextAction = null;
    if (!resume) {
      nextAction = { priority: 'high', action: 'Upload your resume', description: 'Upload your resume to get a detailed AI analysis and score.', link: '/dashboard/resume' };
    } else if (!resume.isAnalyzed) {
      nextAction = { priority: 'high', action: 'Analyze your resume', description: 'Run AI analysis on your uploaded resume to identify strengths and gaps.', link: '/dashboard/resume' };
    } else if (!skillAnalysis) {
      nextAction = { priority: 'high', action: 'Run skill gap analysis', description: 'Identify which skills you need to develop for your target role.', link: '/dashboard/skills' };
    } else if (!roadmap) {
      nextAction = { priority: 'medium', action: 'Generate your learning roadmap', description: 'Get a personalized step-by-step learning plan for your target role.', link: '/dashboard/roadmap' };
    } else if (interviews.length === 0) {
      nextAction = { priority: 'medium', action: 'Take a mock interview', description: 'Practice with AI-powered mock interviews and get instant feedback.', link: '/dashboard/interview' };
    } else {
      const topGap = skillAnalysis?.missingSkills?.[0];
      nextAction = topGap
        ? { priority: 'low', action: `Learn ${topGap}`, description: `Your biggest skill gap is ${topGap}. Start working on it to improve your readiness.`, link: '/dashboard/roadmap' }
        : { priority: 'low', action: 'Keep practicing', description: 'Great progress! Continue with your roadmap and take more mock interviews.', link: '/dashboard' };
    }

    res.json({
      success: true,
      dashboard: {
        overallReadiness,
        scores: {
          resume: resumeScore,
          technical: technicalScore,
          roadmap: roadmapProgress,
          interview: interviewScore,
          profile: profileScore
        },
        hasResume: !!resume,
        hasSkillAnalysis: !!skillAnalysis,
        hasRoadmap: !!roadmap,
        hasCareerRec: !!careerRec,
        recentInterviews: interviews,
        topCareerPath: careerRec?.topRecommendation || null,
        topSkillGaps: skillAnalysis?.missingSkills?.slice(0, 5) || [],
        roadmapProgress: roadmap?.totalProgress || 0,
        nextAction
      }
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({ success: false, message: 'Failed to load dashboard' });
  }
};

module.exports = { getDashboardData };
