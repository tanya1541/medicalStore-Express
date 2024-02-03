const express = require('express');
const router = express.Router();
const paginate = require('express-paginate');
const { body, validationResult } = require('express-validator');


let Medicine = require('../models/medicine');

router.get("/", async (req, res)=>{
    const searchTerm = req.query.search;
    var [results, itemCount] = await Promise.all([
        Medicine.find().limit(req.query.limit).skip(req.skip),
        Medicine.countDocuments({})
    ]);
    if(searchTerm){
        if(searchTerm.trim() !== ""){
        const regex = new RegExp(searchTerm, 'i');
        var [filteredMedicines, filteredItemCount] = await Promise.all([
            Medicine.find({ name: regex }).limit(req.query.limit).skip(req.skip),
            Medicine.countDocuments({name: regex})
        ]);
        results = filteredMedicines;
        itemCount = filteredItemCount;
    }
}
    let pageCount = Math.ceil(itemCount / req.query.limit);
    res.render("index", {
        title: "Medicines",
        medicines: results,
        pageCount, 
        itemCount, 
        pages: paginate.getArrayPages(req)(5, pageCount, req.query.page)
    })
});

 router.get('/add', function(req, res) {
    res.render('add', {
        title: 'Add Medicine'
    })
 });

 router.post('/add',
 [
    body('name').notEmpty().withMessage('Name is required'),
    body('company').notEmpty().withMessage('Company is required'),
    body('expiry_date').notEmpty().withMessage('Expiry Date is required'),
],
function(req,res) {
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.render('add', {
            title: 'Add Medicine',
            errors: errors.array()
        })
    } 
    else {
        let medicine = new Medicine();
        medicine.name = req.body.name;
        medicine.company = req.body.company;
        medicine.expiry_date = req.body.expiry_date;
        medicine.save()
        .then((doc)=> {
            req.flash('success', 'Medicine Added')
            res.redirect('/medicines');
        })
        .catch((err)=> console.log(err));
    }
})

router.get('/:id', function(req, res) {
    Medicine.findById(req.params.id)
        .then((doc)=> {
            res.render('medicine', {
                medicine: doc
            })
        })
        .catch(err=> console.log(err));
 });

 router.get('/edit/:id', function(req, res) {
    Medicine.findById(req.params.id)
    .then((doc)=> {
        res.render('edit', {
            title: "Edit",
            medicine: doc
        })
    })
    .catch(err=> console.log(err));
 });

 router.post('/edit/:id', function(req, res) {
    let medicine = {};
    medicine.name = req.body.name;
    medicine.company = req.body.company;
    medicine.expiry_date = req.body.expiry_date;

    let query = {_id:req.params.id}
    Medicine.updateOne(query, medicine)
        .then((doc)=> {
            req.flash('success', 'Medicine Updated')
            res.redirect('/medicines');
        })
        .catch((err)=> console.log(err))
 });

 router.delete('/delete/:id', function(req, res){
    let medicine = new Medicine();
    medicine.name = req.body.name;
    medicine.company = req.body.company;
    medicine.expiry_date = req.body.expiry_date;
       let query = {_id:req.params.id};
       Medicine.deleteOne(query, medicine)
           .then((event)=>{
               res.send('Success');
           })
           .catch(err=> {
            console.log(err);
        })  
   });

 module.exports = router;
