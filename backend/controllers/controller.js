import bcrypt from "bcrypt";
import dotenv from "dotenv";

dotenv.config();

import jwt from "jsonwebtoken";
import { Admin } from "../models/admin.js";
import { Vendor } from "../models/vendor.js";
import { Product } from "../models/Product.js";
import { Department } from "../models/departments.js";

const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET_KEY, {
    expiresIn: '6h', 
  });
};


export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const hashed = await bcrypt.hash(password, 10);
    console.log(hashed);
    const register = {
      name: name,
      email: email,
      password: hashed,
    };
    let a = await Admin.create(register);
    res.status(200).json("sucesss");
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
export const login = async (req, res) => {
  const { email, password } = req.body.data;
  

  try {

    const user = await Admin.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    const token = generateToken(user._id);
    console.log(token)

    res.cookie('token', token, {
      
      maxAge: 6 * 60 * 60 * 1000, 
     
   
    });

    res.status(200).json({ message: 'Login successful' ,token});
    console.log("done");
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const newVendor = async (req, res) => {
  try {
    const response = await Vendor.create(req.body);
    console.table(response);
    res.status(200).json("New vendor Creatd");
  } catch (error) {
    console.log(error.message);
    res.status(400).json({ message: error.message });
  }
};

export const vendorList = async (req, res) => {
  try {
    const data = await Vendor.aggregate([
      {
        $project: {
          name: 1,
          _id: 0,
          companyName: 1,
          phno: 1,
        },
      },
    ]);
    if (data) {
      console.table(data);
      res.status(200).json(data);
    }
  } catch (error) {
    console.log(error.message);
    res.status(400).json({ message: error.message });
  }
};


export const list = async(req,res)=>{
  try{
    const data = await Product.aggregate([
      {
        $project: {
          units: 1,
          category: 1,
          _id: 0
        }
      },
      {
        $group: {
          _id: "$category",
          units: { $first: "$units" }
        }
      },
      {
        $project: {
          category: "$_id",
          units: 1,
          _id: 0
        }
      }
    ])
    if(data){
      res.status(200).json(data)
    }

  }
  catch(error){
    res.status(400).json(error.message)
    console.log(error.message)
  }
}

export const newItem = async (req, res) => {
  try {
    console.log("Received data:", req.body);
    const product = await Product.create(req.body);
    return res.status(201).json({
      message: "New product created successfully",
      product,
    });
  } catch (error) {
    console.error("Error occurred while creating product:", error.message);
    return res.status(500).json({
      message: "Error occurred while creating product. Please try again.",
      error: error.message,
    });
  }
};
export const itemName = async (req, res) => {
  try{
    const data = await Product.aggregate([
      {
        $project: {
          name:1,
          _id:0
        }
      }
    ])
    if(data){
      res.status(200).json(data)
    }

  }
  catch(error){
    res.status(400).json(error.message)
    console.log(error.message)
  }
};
export const itemDisplay = async (req, res) => {
  try{
    let {query} = req.query
    console.log(query)
    const data = await Product.aggregate([
      {
        '$project': {
          'name': 1, 
          '_id': 0, 
          'description': 1, 
          'units': 1, 
          'quantityInStock': 1,
          'cost':1
        }
      }, {
        '$match': {
          '$or': [
            {
              'name': {
                '$exists': true
              }
            }, {
              '$expr': {
                '$eq': [
                  '$name', ''
                ]
              }
            }
          ]
        }
      }, {
        '$match': {
          'name': {
            '$regex': `${query}`, 
            '$options': 'i'
          }
        }
      }, {
        '$sort': {
          'quantityInStock': 1
        }
      }
    ])
    if(data){
      res.status(200).json(data)
    }

  }
  catch(error){
    res.status(400).json(error.message)
    console.log(error.message)
  }
};

export const vendorLists = async(req,res)=>{
  try{
    const data = await Product.aggregate([
      {
        $project: {
          name:1,
          companyName:1
        }
      }
    ])
    if(data){
      res.status(200).json(data)
    }

    
  }
  catch(error){
    res.status(400).json(error.message)
  }
}


export const productLists = async(req,res)=>{
  try{
    const data = await Product.aggregate([
      {
        $project: {
          name:1,
          description:1,
          quantityInStock:1,
          cost:1,
          units:1
        }
      }
    ])
    if(data){
      res.status(200).json(data)
    }

    
  }
  catch(error){
    res.status(400).json(error.message)
  }
}

export const purchaseOrder = async (req, res) => {
  try {
    const { products, supplier, date, total } = req.body;
    let type = "incoming";

    // Find the vendor details
    const vendorDetails = await Vendor.findOne({ name: supplier });
    if (!vendorDetails) {
      return res.status(404).json({ message: `Vendor ${supplier} not found` });
    }

    let totalAmount = 0;
    let purchaseItems = [];

    for (const transaction of products) {
      const { productId, newQuantity, cost, gst } = transaction;

      // Find the product by ID
      const product = await Product.findById(productId);
      if (!product) {
        return res.status(404).json({ message: `Product with ID ${productId} not found` });
      }

      // Add the transaction to the product's transaction history
      const newTransaction = {
        date: date || new Date(),
        type,
        supplier,
        newQuantity,
        cost,
        gst,
        total: Number(cost) * Number(newQuantity),
        transactionId: vendorDetails._id,
      };

      product.transactions.push(newTransaction);
      product.quantityInStock = Number(product.quantityInStock) + Number(newQuantity);

      // Add to the purchase items array for the vendor's purchase history
      purchaseItems.push({
        name: product.name,
        newQuantity,
        cost,
      });

      totalAmount += Number(cost) * Number(newQuantity); // 
      await product.save();
    }
    

  
    vendorDetails.purchaseHistory.push({
      date: date || new Date(),
      items: purchaseItems,
      totalAmount: totalAmount, 
    });


    await vendorDetails.save();

    res.json('Purchase Order Processed Successfully');
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "An error occurred during the purchase order processing." });
  }
};
