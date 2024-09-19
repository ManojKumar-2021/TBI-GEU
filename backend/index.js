import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';

const app = express();

// Middleware
app.use(cors({ origin: "http://localhost:3000" }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// MongoDB connection
const connectDB = async () => {
  try {
    const db_res = await mongoose.connect(`mongodb+srv://graphiantztt:ixAIg0wbSSinKJ6K@tbigeu.fisg1.mongodb.net/?retryWrites=true&w=majority&appName=tbigeu`, {});
    console.log("MONGODB IS CONNECTED");
  } catch (error) {
    console.log(`MONGODB CONNECTION FAILED ERROR: ${error}`);
    process.exit(1);
  }
};

connectDB();

const paraSchema = new mongoose.Schema({
  para: {
    type: String,
    required: true,
  },
});

const Para = mongoose.model('Para', paraSchema);

// Routes
app.get('/', (req, res) => {
  res.send('home!');
});

app.post('/items', async (req, res) => {
  try {
    const { para } = req.body;
    const newPara = new Para({ para });
    const savedPara = await newPara.save();
    res.status(201).json(savedPara);
  } catch (err) {
    console.error("Error while creating para:", err);
    res.status(400).json({ message: err.message });
  }
});

app.get('/items', async (req, res) => {
  try {
    const items = await Para.find();
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.put('/items/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { para } = req.body; 
    console.log(id,para)
    const updatedPara = await Para.findByIdAndUpdate(id, { para });
    if (!updatedPara) return res.status(404).json({ message: 'Para not found' });
    res.json(updatedPara);
  } catch (err) {
    console.error("Error while updating para:", err);
    res.status(400).json({ message: err.message });
  }
});


app.delete('/items/:id', async (req, res) => {
  try {
    const { id } = req.params; 
    const deletedPara = await Para.findByIdAndDelete(id);
    if (!deletedPara) return res.status(404).json({ message: 'Para not found' });
    res.json({ message: 'Para deleted successfully' });
  } catch (err) {
    console.error("Error while deleting para:", err);
    res.status(500).json({ message: err.message });
  }
});

// Start the server
app.listen(8080, () => {
  console.log('Server is running on port 8080');
});
