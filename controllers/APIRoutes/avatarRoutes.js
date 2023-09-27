const express = require ("express");
const router = express.Router();
const {Avatars} = require("../../models"); 

//Create a new avatar
router.post("/", async (req, res) =>{
  try{
      const avatar = await Avatars.create(req.body);
      //If avatar was successfully created, respond with a 201 created status code
      res.status(201).json(avatar);
      //If an error occured during the process, catch and responds with a 400 bad request status code
  } catch (error) {
      res.status(400).json({ error: error.message});
  }
});

//Delete an avatar by ID
router.delete('/:id', async (req, res) => {
try {
  //Attempts to delete the avatar
  const deleted = await Avatars.destroy({
    where: { id: req.params.id },
  });
  //Checks if avatar deleted was successful
  if (deleted) {
    //Status 204 code if successfully deleted
    res.status(204).json({ message: 'Avatar deleted' });
  } else {
    //Status 404 code if avatar not found
    res.status(404).json({ error: 'Avatar not found' });
  }
  //Catches any errors that occur during process
} catch (error) {
  res.status(500).json({ error: error.message });
}
});

//Get all avatars
router.get("/", async (req, res) => {
    try {
      const avatars = await Avatars.findAll();
      //If avatars found successfully, respond with 200 OK status code
      res.status(200).json(avatars);
      //If an error occured during the process, catch and responds with a 400 bad request status code
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });

//Get specific avatar by id
router.get("/:id", async (req,res)=>{
  try {
    //Attempts to find an avatar in the database by its ID
    const avatar = await Avatars.findByPk(req.params.id);
    //If an avatar is found, respond with a 200 OK status and the avatar data
    if (avatar) {
      res.status(200).json(avatar);
      }else{
        //If no avatar is found, respond with a 404 Not Found status and an error message
        res.status(404).json({ error: "Avatar not found"});
      }
    } catch (error) {
       //If an error occured during the process, catch and responds with a 400 bad request status code
      res.status(400).json({ error: error.message});
    }
    });

// Update a avatar by id
router.put("/:id", async (req, res) => {
  try {
    // Attempt to update the avatar with the provided data
    const [updated] = await Avatars.update(req.body, {
      where: { id: req.params.id },
    });
    if (updated) {
      //Fetch the updated avatar from the database if one record was updated
      const updatedAvatar = await Avatars.findByPk(req.params.id);
      //Respond with a 200 OK status and the updated avatar data
      res.status(200).json(updatedAvatar);
    } else {
      //If no avatar updated, responds with a 404 Not Found status
      res.status(404).json({ error: "Avatar not found"});
    }
  } catch (error) {
    //If an error occured during the process, catch and responds with a 400 bad request status code
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;