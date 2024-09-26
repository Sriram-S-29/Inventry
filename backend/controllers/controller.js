import bcrypt from "bcrypt";
import dotenv from "dotenv";
import mongoose from "mongoose";
const ObjectId = mongoose.Types.ObjectId;

dotenv.config();

import jwt from "jsonwebtoken";
import { Admin } from "../models/admin.js";
import { Vendor } from "../models/vendor.js";
import { Product } from "../models/Product.js";
import { Departments } from "../models/departments.js";

const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET_KEY, {
    expiresIn: "6h",
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
    console.log(token);

    res.cookie("token", token, {
      maxAge: 6 * 60 * 60 * 1000,
    });

    res.status(200).json({ message: "Login successful", token });
    console.log("done");
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Internal server error" });
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

export const list = async (req, res) => {
  try {
    const data = await Product.aggregate([
      {
        $project: {
          units: 1,
          category: 1,
          _id: 0,
        },
      },
      {
        $group: {
          _id: "$category",
          units: { $first: "$units" },
        },
      },
      {
        $project: {
          category: "$_id",
          units: 1,
          _id: 0,
        },
      },
    ]);
    if (data) {
      res.status(200).json(data);
    }
  } catch (error) {
    res.status(400).json(error.message);
    console.log(error.message);
  }
};

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
  try {
    const data = await Product.aggregate([
      {
        $project: {
          name: 1,
          _id: 0,
        },
      },
    ]);
    if (data) {
      res.status(200).json(data);
    }
  } catch (error) {
    res.status(400).json(error.message);
    console.log(error.message);
  }
};
export const itemDisplay = async (req, res) => {
  try {
    let { query } = req.query;
    console.log(query);
    const data = await Product.aggregate([
      {
        $project: {
          name: 1,
          _id: 1,
          description: 1,
          units: 1,
          quantityInStock: 1,
          cost: 1,
        },
      },
      {
        $match: {
          $or: [
            {
              name: {
                $exists: true,
              },
            },
            {
              $expr: {
                $eq: ["$name", ""],
              },
            },
          ],
        },
      },
      {
        $match: {
          name: {
            $regex: `${query}`,
            $options: "i",
          },
        },
      },
      {
        $sort: {
          quantityInStock: 1,
        },
      },
    ]);
    if (data) {
      res.status(200).json(data);
    }
  } catch (error) {
    res.status(400).json(error.message);
    console.log(error.message);
  }
};

export const vendorLists = async (req, res) => {
  try {
    const data = await Product.aggregate([
      {
        $project: {
          name: 1,
          companyName: 1,
        },
      },
    ]);
    if (data) {
      res.status(200).json(data);
    }
  } catch (error) {
    res.status(400).json(error.message);
  }
};

export const productLists = async (req, res) => {
  try {
    const data = await Product.aggregate([
      {
        $project: {
          name: 1,
          description: 1,
          quantityInStock: 1,
          cost: 1,
          units: 1,
        },
      },
    ]);
    if (data) {
      res.status(200).json(data);
    }
  } catch (error) {
    res.status(400).json(error.message);
  }
};

export const purchaseOrder = async (req, res) => {
  try {
    const { products, supplier, date, total } = req.body;
    let type = "incoming";

    const vendorDetails = await Vendor.findOne({ name: supplier });
    if (!vendorDetails) {
      return res.status(404).json({ message: `Vendor ${supplier} not found` });
    }

    let totalAmount = 0;
    let purchaseItems = [];

    for (const transaction of products) {
      const { productId, newQuantity, cost, gst } = transaction;

      const product = await Product.findById(productId);
      if (!product) {
        return res
          .status(404)
          .json({ message: `Product with ID ${productId} not found` });
      }

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
      product.quantityInStock =
        Number(product.quantityInStock) + Number(newQuantity);

      purchaseItems.push({
        name: product.name,
        newQuantity,
        cost,
      });

      totalAmount += Number(cost) * Number(newQuantity); 
      await product.save();
    }

    vendorDetails.purchaseHistory.push({
      date: date || new Date(),
      items: purchaseItems,
      totalAmount: totalAmount,
    });

    await vendorDetails.save();

    res.json("Purchase Order Processed Successfully");
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      message: "An error occurred during the purchase order processing.",
    });
  }
};

export const newDepartment = async (req, res) => {
  try {
    const { newDept } = req.body;
    console.log(newDept);

    const existingDept = await Departments.findOne({ name: newDept.dName });
    console.log(Departments);
    if (existingDept) {
      return res.status(409).json({ message: "Department already exists." });
    }

    const result = await Departments.create(newDept);
    res.status(201).json(result);
  } catch (error) {
    console.error(error.message);
    res
      .status(500)
      .json({ message: "An error occurred during the department creation." });
  }
};

export const getDepartmentsList = async (req, res) => {
  try {
    const departmentList = await Departments.aggregate([
      {
        $project: {
          dName: 1,
        },
      },
    ]);
    const datas = await Product.aggregate([
      {
        $project: {
          name: 1,
          description: 1,
          quantityInStock: 1,
          cost: 1,
          units: 1,
        },
      },
    ]);
    const purpose = await Product.aggregate([
      {
        $unwind: {
          path: "$transactions",
        }
      },
      {
        $replaceRoot: {
          newRoot: "$transactions"
        }
      },
      {
        $match: {
          type:'outgoing'
        }
        
      },
      {
        $project: {
          purpose:1,
          _id:0
        }
      }
    ])
    
    res.status(200).json({ departmentList, datas,purpose });
  } catch (error) {
    console.error(error.message);
    res.status(500).json(error.message);
  }
};

export const newOutgoing = async (req, res) => {
  try {
    console.log(req.body);
    const { dName, date, purpose, products } = req.body;
    let Dtrans = [];

    const departmentDetail = await Departments.findOne({ dName: dName });
    console.log(departmentDetail);

    for (const transaction of products) {
      const productDetail = await Product.findOne({
        name: transaction.product,
      });

      let trans = {
        type: "outgoing",
        date: date,
        newQuantity: transaction.quantity,
        customer: dName,
        transactionId: departmentDetail._id,
        purpose:purpose
      };

      console.log(trans);
      productDetail.transactions.push(trans);
      console.log(transaction.quantity);

      productDetail.quantityInStock =
        Number(productDetail.quantityInStock) - Number(transaction.quantity);
      console.log("new quantity");

      await productDetail.save();

      Dtrans.push({
        date: date,
        product: transaction.product,
        quantity: transaction.quantity,
        purpose: purpose,
      });
    }

    departmentDetail.purchaseRecords.push(...Dtrans);
    await departmentDetail.save();

    res.status(200).json("Succes");
  } catch (error) {
    console.log(error.message);
    res.status(500).json(error.message);
  }
};

export const itemDetail = async (req, res) => {
  try {
    const id = req.query.id;
    console.log(req.query);
    const response = await Product.aggregate([
      {
        $match: {
          _id: new ObjectId(id),
        },
      },
      {
        $project: {
          transactions: 0,
        },
      },
    ]);
    console.log(response);
    res.status(200).json(response[0]);
  } catch (error) {
    res.status(500).json(error.message);
    console.log(error.message);
  }
};

$match: {
  $or: [{ type: "" }, { type: { $exists: "" } }];
}

// {
//   $match: {
//     $or: [{ type: "outgoing" }, { type: { $exists: false } }],
//   },
// },

export const ItemTransction = async (req, res) => {
  try {
    const id = req.query.id;
    const response = await Product.aggregate([
      {
        $match: {
          _id: new ObjectId(id),
        },
      },
      {
        $unwind: {
          path: "$transactions",
        },
      },
      {
        $replaceRoot: {
          newRoot: "$transactions",
        },
      },
      {
        $match: {
          $or: [{ type: "" }, { type: { $exists: "" } }],
        },
      },
      {
        $sort: {
          date: -1
        }
      }
    ]);
    res.status(200).json(response);
  } catch (error) {
    console.log(error.message);
  }
};


export const getdata = async(req,res)=>{
  try{
    const id = req.query.id

    const response = await Product.aggregate([
      {
        $match: {
          _id: new ObjectId(id)
        }
      },
      {
        $unwind: {
          path: '$transactions'
        }
      },
      {
        $replaceRoot: {
        newRoot: {
          $mergeObjects: [
            "$transactions",
            { unit: "$units",
            name:'$name'}
          ]
        }
        }
    }
    ])
    console.table(response)
    res.status(200).json(response);
  }
  catch(error){

    console.log(error.message)
    
  }
}

export const departmentList = async(req,res)=>{
  try{
    const {query} = req.query
    console.log(query)

    const response = await Departments.aggregate([
      {
        $match: {
          $or:[
            {
              dName:{
                $exists:true
              }
            },
            {
              $expr:{
                $eq:["$dName",'']
              }
            }
          ]
        }
        
      },
      {
        $match: {
          dName:{
            $regex:`${query}`,
            $options:'i'
          }
        }
      },
      {
        $project: {
          dName:1,
          contact:1
        }
      }
    ])
    console.table(response)
    res.status(200).json(response)

  }
  catch(error){
    console.log(error.message)
  }
}