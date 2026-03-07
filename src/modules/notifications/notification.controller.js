const notificationService = require('./notification.service');

async function send(req,res,next){
  try{

    const { userId,title,message,type } = req.body;

    await notificationService.sendNotification({
      userId,
      title,
      message,
      type
    });

    res.json({
      success:true
    });

  }catch(err){
    next(err);
  }
}

module.exports={
  send
};
