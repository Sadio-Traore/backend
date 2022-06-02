
 const Sauce = require('../models/Sauce');

 exports.createSauce = (req, res, next) => {
     const sauceObject = JSON.parse(req.body.sauce);
     delete req.body._id;
     const sauce = new Sauce({
        ...sauceObject,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.fileName}`
     });
     sauce.save()
       .then(() => res.status(201).json({ message : 'Sauce enregistrée !'}))
       .catch(error => res.status(400).json ({error}));
 };

 exports.modifySauce = (req, res, next) => {
     Sauce.updateOne ({ _id: req.params.id},{...req.body, _id: req.params.id})
       .then(() => res.status(200).json({ message : 'Sauce modifiée'}))
       .catch(error => res.status(400).json({error}));
 };

 exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({_id: req.params.id})
        .then((sauce) => {
            if(!sauce) {
                return res.status(404).json({
                    error: new Error ('Sauce non trouvé')
                });
            }
            if (sauce.userId !== req.auth.userId){
                return res.status(401).json({
                    error: new Error ('Requête non autorisée')
                })
            }
            Sauce.deleteOne ({_id: req.params.id})
            .then(() => res.status(200).json({message : 'Sauce supprimée'}))
            .catch(error => res.status(400).json({error}));

        })
 };

 exports.getOneSauce = (req, res, next) => {
    
   Sauce.findOne ({_id: req.params.id})
   .then(sauce => res.status(200).json({sauce}))
   .catch(error => res.status(400).json({error}));
 }

 exports.getAllSauces = (req, res, next) => {
   Sauce.find ()
   .then(sauces => res.status(200).json({sauces}))
   .catch(error => res.status(400).json({error}));
 }
 