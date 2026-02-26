const contact = require("../model/contactSchema");

// Create Contact
const createContact = async (req, res) => {
    const {name, email, phone, subject, message} = req.body;
    if(!name || !email || !phone || !subject || !message){
        return res.status(400).json({message: "Please fill all the fields"});
    }
    try {
        const Newcontacts = new contact({
        name : name,
        email: email,
        phone: parseInt(phone),
        subject : subject,
        message: message ,
    });
    await Newcontacts.save();
        res.status(201).json({message: 'Thank you for contacting us'});
    } catch (error) {
        console.error("Error creating form:", error);
        res.status(500).json({message: "Server Error"});
    }
};

// Get All Contacts
const getAllContacts = async (req, res) => {
  try {
        const allcontacts = await contact.find();
        res.status(201).json(allcontacts);
  } catch (error) {
        res.status(500).json({message: "Server Error"});
  }
};

// Get Single Contact
const getTripBySingle = async (req, res) => {
    const {name} = req.params;
    try{
        const contactByOne = await contact.findOne({name: name});
        if (!contactByOne){
            return res.status(404).json({message: 'Contact not found.'});
        }
        res.status(201).json(contactByOne);
    } catch(error){
        res.status(500).json({message: "Server Error"});
    }
};


// Delete Contact
const deleteContact = async (req, res) => {
    const {name} = req.params;
    try{
        const tripDelete = await contact.findOneAndDelete({name: name});
        if (!tripDelete){
            return res.status(404).json({message: "Contact not found"});
        }
        res.status(201).json({message: "Contact deleted successfully"});
    } catch(error){
        res.status(500).json({message: "Server Error"});
    }
};

module.exports = {createContact, getAllContacts, getTripBySingle, deleteContact};