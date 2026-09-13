const Profile = require('../models/Profile');
const User = require('../models/User');

// @desc    Get user profile
// @route   GET /api/profile
const getProfile = async (req, res) => {
  try {
    let profile = await Profile.findOne({ userId: req.user.id });
    if (!profile) {
      profile = await Profile.create({ userId: req.user.id });
    }
    const user = await User.findById(req.user.id);
    res.json({ success: true, profile, user });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch profile' });
  }
};

// @desc    Update user profile
// @route   PUT /api/profile
const updateProfile = async (req, res) => {
  try {
    const { academicDetails, technicalSkills, careerInfo, personalInfo } = req.body;

    let profile = await Profile.findOne({ userId: req.user.id });
    if (!profile) {
      profile = new Profile({ userId: req.user.id });
    }

    if (academicDetails) profile.academicDetails = { ...profile.academicDetails, ...academicDetails };
    if (technicalSkills) profile.technicalSkills = { ...profile.technicalSkills, ...technicalSkills };
    if (careerInfo) profile.careerInfo = { ...profile.careerInfo, ...careerInfo };
    if (personalInfo) profile.personalInfo = { ...profile.personalInfo, ...personalInfo };

    profile.completionScore = profile.calculateCompletion();
    await profile.save();

    res.json({ success: true, message: 'Profile updated successfully', profile });
  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({ success: false, message: 'Failed to update profile' });
  }
};

// @desc    Update basic user info
// @route   PUT /api/profile/user
const updateUserInfo = async (req, res) => {
  try {
    const { fullName, college, degree, graduationYear } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { fullName, college, degree, graduationYear },
      { new: true, runValidators: true }
    );
    res.json({ success: true, message: 'User info updated', user });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update user info' });
  }
};

module.exports = { getProfile, updateProfile, updateUserInfo };
