import './App.css';
import React, { useState, useEffect } from 'react';
import axios from "axios";
import Formtable from './component/Formtable'; 

axios.defaults.baseURL = "http://localhost:8080/";

function App() {
  const [addSection, setAddSection] = useState(false);
  const [editSection, setEditSection] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: ''
  });

  const [formDataEdit, setFormDataEdit] = useState({
    name: '',
    email: '',
    mobile: '',
    _id: ''
  });
  
  const [dataList, setDataList] = useState([]);

  const handleOnChange = (e) => {
    const { value, name } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("/create", formData);
      alert(response.data.message);
      // Reset form data
      setFormData({
        name: '',
        email: '',
        mobile: ''
      });
      // Hide the form
      setAddSection(false);
      // Fetch updated data list
      getFetchData();
    } catch (error) {
      console.error('Error submitting form', error);
    }
  };

  const getFetchData = async () => {
    try {
      const response = await axios.get("/");
      console.log('Fetched data:', response.data);
      if (response.data.success) {
        setDataList(response.data.data);
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      console.error('Error fetching data', error);
    }
  };

  useEffect(() => {
    getFetchData();
  }, []);

  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(`/delete/${id}`);
      if (response.data.success) {
        getFetchData();
        alert(response.data.message);
      }
    } catch (error) {
      console.error('Error deleting data', error);
    }
  };
  
  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put("/update", formDataEdit);
      if (response.data.success) {
        // Fetch updated data list
        getFetchData();
        alert(response.data.message);
        // Hide the edit form
        setEditSection(false);
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      console.error('Error updating data', error);
    }
  };
  const handleEditOnChange = (e) => {
    const { value, name } = e.target;
    setFormDataEdit((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleEdit = (el) => {
    setFormDataEdit(el);
    setEditSection(true);
  };

  return (
    <>
      <div className="container">
        <button className="btn btn-add" onClick={() => setAddSection(true)}>Add</button>
        {addSection && (
          <Formtable 
            handleSubmit={handleSubmit}
            handleOnChange={handleOnChange}
            handleclose={() => setAddSection(false)} 
            rest={formData}
          />
        )}

        {editSection && ( 
          <Formtable 
            handleSubmit={handleUpdate}
            handleOnChange={handleEditOnChange}
            handleclose={() => setEditSection(false)} 
            rest={formDataEdit}
          />
        )}

        <div className="tableContainer">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Mobile</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {dataList.length > 0 ? (
                dataList.map((el) => (
                  <tr key={el._id}>
                    <td>{el.name}</td>
                    <td>{el.email}</td>
                    <td>{el.mobile}</td>
                    <td>
                      <button className="btn btn-edit" onClick={() => handleEdit(el)}>Edit</button>
                      <button className="btn btn-delete" onClick={() => handleDelete(el._id)}>Delete</button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" style={{ textAlign: "center" }}>
                    No data available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

export default App;
