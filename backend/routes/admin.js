
import { Router } from 'express';
const admin = Router();
import cors from 'cors';
import { Token} from '../Authenticate/login.js';

import { list, login, newItem, newVendor, register, vendorList,itemName,itemDisplay,vendorLists,productLists,purchaseOrder,newDepartment,getDepartmentsList,newOutgoing,itemDetail,ItemTransction,getdata,departmentList,getHistory ,purchaseHistory,specificHistory} from '../controllers/controller.js';
admin.use(cors());
const corsOptions = {
  origin: "http://localhost:5173", 
  credentials: true, 
};
admin.use(cors(corsOptions));

admin.post('/register',Token,register);
admin.post('/login',Token,login);
admin.post('/newVendor',newVendor);
admin.get('/vendorList',vendorList);
admin.post('/newItem',newItem)
admin.get('/list',list)
admin.get('/itemName',itemName)
admin.get('/itemList',itemDisplay)
admin.get('/vendorList',vendorLists)
admin.get('/productLists',productLists)
admin.post('/purchaseOrder',purchaseOrder)
admin.post('/newDepartment',newDepartment)
admin.get('/departmentList',getDepartmentsList)
admin.post('/outgoing',newOutgoing)
admin.get('/itemDetail',itemDetail)
admin.get('/transaction',ItemTransction)
admin.get('/departmentLists',departmentList)
admin.get('/getdata',getdata)
admin.get('/getHistory',getHistory)
admin.get('/purchaseHistory',purchaseHistory)
admin.get('/specificHistory',specificHistory)



export default admin;
