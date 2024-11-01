const mongoose = require('mongoose');
const User = mongoose.model('User');
const responseHandler = require('../helpers/responseHandler');
// Controller function to set retirement goal
const profileUpdate = async (req, res) => {
    const user=req.user
  const { username,age,retirementAge,targetAmount,targetDate,currentSavings } = req.body;
  console.log("req",req.body)
  try {
    // Find user by ID (assumes req.user.id is set by authentication middleware)
    const user = await User.findById(req.user._id);
    if (!user) {
        return responseHandler.handleErrorResponse(res, 404, 'User not found');
    }
    // Update user document with new data
    if (username !==user.username){
        const userexit=await User.findOne({username})
        if(userexit){
            return responseHandler.handleErrorResponse(res, 400, 'User already exist');
        }
        else{
            user.userName=username
        }
    }
    if (age) user.age = age;
    if (retirementAge) user.retirementAge = retirementAge;
    if (targetAmount) user.goals.targetAmount = targetAmount;
    if (targetDate) user.goals.targetDate = targetDate;
    if (currentSavings) user.currentSavings = currentSavings;
    console.log("user",user)
    await user.save();
    return responseHandler.handleSuccessResponse(res, 'Profile updated successfully', 200);

   

  } catch (error) {
    console.error(error);
    return responseHandler.handleException(res, error);
  }
};


const setRetirementGoal=async (req,res)=>{
  try{
  const user=req.user;
  const {targetDate,targetAmount} =req.body;
  console.log("data==",req.body)
  const userData=await User.findById(user._id);
  userData.goals.targetAmount=targetAmount;
  userData.goals.targetDate=new Date(targetDate);
  userData.save();
  return responseHandler.handleSuccessResponse(res,'Successfully set Goal Target')
  }
  catch(err){
    return responseHandler.handleException(res, err);
  }
}

module.exports = { profileUpdate,setRetirementGoal };
