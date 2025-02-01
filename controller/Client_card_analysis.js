const Client_card_analysis  = require('../models/Client_card_analysisModels');

exports.getAnalyis = async (req,res)=>{
    const client_card_analysis = await Client_card_analysis.query().select('*')
    return res.status(200).json({success:true, analyis: client_card_analysis})
}

exports.postAnalayis = async (req,res) =>{
    const {naber_card, Expiration_date_cart} = req.body
    if( Expiration_date_cart.length <= 7 ){
        return res.status(400).json({success:false, msg:'namber is not'})
 }

}