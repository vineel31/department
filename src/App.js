import './App.css';
import { DataGrid, GridActionsCellItem } from '@mui/x-data-grid';
import { GridToolbar } from '@mui/x-data-grid-pro';
import React from 'react';
import axios from 'axios';
import apiUrlMapping from '../src/resources/apiMapping.json';
import { useEffect } from 'react';
import { useState } from 'react';
import { Button } from '@mui/material';
import { TextField } from '@mui/material';
import { Dialog, DialogContent, DialogActions, DialogTitle} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import PreviewIcon from '@mui/icons-material/Preview';

const geRowsWithId = (rows) => {  
  let id = 0
  let completeRowListArray = []
  for (let row of rows) {
    const rowsWithId = {
      id: id,
      ...row
    }
    id++
    completeRowListArray.push(rowsWithId)
  }
  return completeRowListArray
}
export default function App() {

  const employeeTable = 
  [
    {
      field:'actions',
      type:'actions',
      width:100,
      getActions:(event)=>[
        
        <GridActionsCellItem onClick={(e)=>onClickOfEditButton(event)}icon={<EditIcon/>}label="Edit"/>,
        <GridActionsCellItem onClick={(e)=>deleteRecord(event.id)}icon={<DeleteIcon/>}label="Delete"/>,
        <GridActionsCellItem onClick={(e)=>onClickOfViewButton(event)}icon={<PreviewIcon/>}label="view"/>
      ],
    },
    {
      field: 'department_ID',
      headerName: 'department_ID',
      width : 190
    },
    {
      field: 'department_NAME',
      headerName: 'department_NAME',
      width : 190
    },
    {
      field: 'manager_ID',
      headerName: 'manager_ID',
      width : 190
    },
    {
      field: 'location_ID',
      headerName: 'location_ID',
      width : 190
    }
  ]

  const [rows, setRows] = React.useState([])
  const [addOrEdit, setAddOrEdit] = React.useState("")
  const [editId,setEditId]=React.useState("")
  const handleClickOpen = () => {setOpen(true);};
  const [open, setOpen] = React.useState(false);
  const [department_ID, setdepartment_ID] 	= React.useState("");
  const [department_NAME, setdepartment_NAME] 	= React.useState("");
  const [manager_ID, setmanager_ID] 			= React.useState("");
  const [location_ID, setlocation_ID] 			= React.useState("");
  const handleClose = () => {setOpen(false);};
  const [viewId, setViewId] = React.useState("")

 
  const getAllRecords=()=>
  {
    axios.get(apiUrlMapping.employeeData.getAll).then(response =>
	{
    setRows(geRowsWithId(response.data))
    });
  }

  const onClickofSaveRecord = () => 
  {
    setAddOrEdit("Save")
    handleClickOpen()
  }

  useEffect(() => {getAllRecords()}, []);

  const addOrEditRecordAndClose = (type) => 
  {
     if (type === "Edit") {editRecordAndClose()}
    if (type === "Save") {addRecordAndClose() }
    //if (type === "View") {viewRecordAndClose()}
  }

  const addRecordAndClose = () => 
  {
    if (department_ID !== undefined &&  department_NAME !== undefined &&  manager_ID !== undefined && location_ID !== undefined)
	{
      let payload = 
	  {
        "department_ID": department_ID,
        "department_NAME": department_NAME,
        "manager_ID": manager_ID,
        "location_ID": location_ID
      }
      //console.log("The Data to DB is " + payload)
      axios.post(apiUrlMapping.employeeData.post, payload).then(response => 
	  {
	  getAllRecords()
        handleClose()
        setdepartment_ID("")
        setdepartment_NAME("")
        setmanager_ID("")
        setlocation_ID("")
      })
    }
  }
  const deleteRecord=(index)=>{
    let dataId=rows[index]._id;
    axios.delete(apiUrlMapping.employeeData.delete + "/" + dataId).then(()=>{getAllRecords();});
  }

  const onClickOfEditButton=(e)=>{
    setAddOrEdit("Edit");
    let editRecord=rows[e.id]
    setdepartment_ID(editRecord.department_ID)
    setdepartment_NAME(editRecord.department_NAME)
    setmanager_ID(editRecord.manager_ID)
    setlocation_ID(editRecord.location_ID)
    setEditId(editRecord._id)
    handleClickOpen()
  }

  const editRecordAndClose=()=>{
    if(department_ID !== undefined &&  department_NAME !== undefined &&  manager_ID !== undefined && location_ID !== undefined){
      let payload={
        "department_ID": department_ID,
        "department_NAME": department_NAME,
        "manager_ID": manager_ID,
        "location_ID": location_ID
      }
      axios.put(apiUrlMapping.employeeData.put + "/"+editId,payload).then(response=>
        {
          getAllRecords()
          handleClose()
        })
    }
  }

  /*const onClickOfPreviewButton=(e)=>{
    
    //setAddOrEdit("Edit");
    let editRecord=rows[e.id]
    setdepartment_ID(editRecord.department_ID)
    setdepartment_NAME(editRecord.department_NAME)
    setmanager_ID(editRecord.manager_ID)
    setlocation_ID(editRecord.location_ID)
    setEditId(editRecord._id)
    handleClickOpen()
    axios.get(apiUrlMapping.jobData.get + "/" + viewId).then(response => 
      {
        getAllRecords()
        handleClose()
      })
  }*/
  const onClickOfViewButton = (e) =>
    {
        setAddOrEdit("View")
        viewRecordAndClose(e)  
        let viewRecord = rows[e.id]
        setdepartment_ID(viewRecord.department_ID)
        //console.log(editRecord.regionID)
        setdepartment_NAME(viewRecord.department_NAME)
        setmanager_ID(viewRecord.manager_ID)
        setlocation_ID(viewRecord.location_ID)
      setViewId(viewRecord._id)
      handleClickOpen()
      
    }
    const viewRecordAndClose=()=>{
        axios.get(apiUrlMapping.employeeData.getById + "/" + viewId).then(response => 
            {
              getAllRecords()
              //handleClose()
            })
    }

  return (
    <div className="App">
      <div className="text-alligned">
        <h1 className='h1'>Department Data</h1>
      </div>
      <div style={{ height: "50vh", width: "100%" }}>
      <DataGrid
          rows = {rows}
          columns = {employeeTable}
          components={{Toolbar: GridToolbar,}}
          componentsProps={{toolbar: { showQuickFilter: true }}}
          pageSize={5}
          rowsPerPageOptions={[10]}
          checkboxSelection
          disableSelectionOnClick
        />
  </div>
  <div className="center" >
          <Button variant="contained" onClick={onClickofSaveRecord} >Add Record</Button>
  </div>

  <Dialog open={open} onClose={handleClose} >
        <DialogTitle className="d">Save Department Data</DialogTitle>
        <DialogContent>
          <TextField disabled={addOrEdit==="View"} autoFocus margin="dense" id="department_ID"  onChange={(e) => { setdepartment_ID(e.target.value) }}value={department_ID}label="First Name"type="text" fullWidth/>
          <TextField disabled={addOrEdit==="View"} autoFocus margin="dense" id="department_NAME" onChange={(e) => { setdepartment_NAME(e.target.value) }}value={department_NAME} label="Last Name" type="text" fullWidth/>
          
          <TextField disabled={addOrEdit==="View"} autoFocus margin="dense" id="manager_ID" onChange={(e) => { setmanager_ID(e.target.value) }} value={manager_ID} label="manager_ID" type="text" fullWidth/>
          <TextField disabled={addOrEdit==="View"} autoFocus margin="dense" id="location_ID" onChange={(e) => { setlocation_ID(e.target.value) }} value={location_ID} label="location_ID" type="text" fullWidth/>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={() => { addOrEditRecordAndClose(addOrEdit) }}>Save</Button>
        </DialogActions>
  </Dialog>

      
    </div>
  );
}
