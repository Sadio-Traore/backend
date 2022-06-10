
 const Sauce = require('../models/Sauce');
 const fs = require('fs');

 exports.createSauce = (req, res, next) => {
     const sauceObject = JSON.parse(req.body.sauce);
     delete sauceObject._id;
     const sauce = new Sauce({
        ...sauceObject,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
        likes: 0,
        dislikes: 0,
        usersLiked: [' '],
        usersdisLiked: [' ']
     });
     sauce.save()
       .then(() => res.status(201).json({ message : 'Sauce enregistrée !'}))
       .catch(error => res.status(400).json ({error}));
 };

 exports.modifySauce = (req, res, next) => {
     const sauceObject = req.file ?
     {
         ...JSON.parse(req.body.sauce),
         imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.fileName}`
     } : {...req.body};
     Sauce.updateOne ({ _id: req.params.id},{...sauceObject, _id: req.params.id})
       .then(() => res.status(200).json({ message : 'Sauce modifiée'}))
       .catch(error => res.status(400).json({error}));
 };

 exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({_id: req.params.id})
        .then(sauce => {
            const fileName = sauce.imageUrl.split('/images/')[1];
            fs.unlink(`images/${fileName}`, () => {
              Sauce.findOne({_id: req.params.id})
                .then((sauce) => {
                    Sauce.deleteOne ({_id: req.params.id})
                    .then(() => res.status(200).json({message : 'Sauce supprimée'}))
                    .catch(error => res.status(400).json({error}));
        
                });

            });
        })
        .catch(error => res.status(500).json({error}));
 };

 exports.getOneSauce = (req, res, next) => {
    
   Sauce.findOne ({_id: req.params.id})
   .then(sauce => res.status(200).json(sauce))
   .catch(error => res.status(400).json({error}));
 }

 exports.getAllSauces = (req, res, next) => {
   Sauce.find()
   .then(sauces => res.status(200).json(sauces))
   .catch(error => res.status(400).json({error}));
 }
 
 // Système de like/ dislike


 exports.likeSauce = (req, res, next) => {
    let like = req.body.like
    let userId = req.body.userId
    let sauceId = req.params.id
    console.log(req.body)
    console.log(req.body.like)

    switch (like) {
        case 1 :
            Sauce.updateOne(
                { _id: sauceId }, 
                { 
                    $push: { usersLiked: userId },
                    $inc: { likes: +1 }
                }
                 )
            .then(() => res.status(200).json({ message: "J'aime" }))
            .catch((error) => res.status(404).json({ error }))
        
        break;
  
        
        case -1 :
            Sauce.updateOne(

                { _id: sauceId }, 
                { 
                    $inc: { dislikes: +1 },
                    $push: { usersDisliked: userId }
                }
                 )
            .then(() => { res.status(200).json({ message: "Je n'aime pas" }) })
            .catch((error) => res.status(404).json({ error }))
            
            
            break;
            
            case 0 :
                Sauce.findOne({ _id: sauceId })
                   .then((sauce) => {
                    if (sauce.usersLiked.includes(userId)) { 
                      Sauce.updateOne(

                        { _id: sauceId }, 
                        { 
                              $inc: { likes: -1 },
                              $pull: { usersLiked: userId } 
                        }
                            )
                        .then(() => res.status(200).json({ message: "Neutre" }))
                        .catch((error) => res.status(404).json({ error }))
                    }
                    if (sauce.usersDisliked.includes(userId)) { 
                      Sauce.updateOne(
                        { _id: sauceId }, 
                        { 
                              $inc: { dislikes: -1 },
                              $pull: { usersDisliked: userId }
                        }
                            )
                        .then(() => res.status(200).json({ message: "Neutre" }))
                        .catch((error) => res.status(404).json({ error }))
                    }
                  })
                  .catch((error) => res.status(404).json({ error }))
              break;

            default:
                console.log(error);
            }
} 
