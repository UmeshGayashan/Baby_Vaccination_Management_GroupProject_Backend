import { Button } from "@mui/material";
import DesktopDatePicker from "../../components/DesktopDatePicker";
import "../pageCss/UserPage.css";
import Footer from "../../components/Footer";
import React, { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import "../../components/comCss/Minheight.css";
import LANavbar from "../../components/LA_Nav";
import HAdminDashBoard from "../../components/HighAdminDashboard";
import ANotificationList from "../../components/AdminNotification";
import BGRectangle from "../../components/BGRectangle";

const columns = [
  {
    field: 'motherorGuardianName',
    headerName: 'Guardian Name',
    width: 200,
    valueGetter: (params) => {
      const name = params.row.motherorGuardianName;
      return name ? `${name.firstName} ${name.lastName}` : 'N/A';
    }
  },
  { field: 'motherorGuardianNIC', headerName: 'NIC', width: 150 },
  { field: 'Address', headerName: 'Address', width: 200 },
  { field: 'PostalCode', headerName: 'Postal Code', width: 100 },
  { field: 'guardianEmail', headerName: 'Email', width: 200 },
  { field: 'guardianTelephoneNumber', headerName: 'Telephone', width: 150 },
  { field: 'username', headerName: 'Username', width: 150 },
  { field: 'additionalInfo', headerName: 'Additional Info', width: 200 },
];

const HighAdminChild = () => {
  const [rows, setRows] = useState([]);

  useEffect(() => {
    const fetchParents = async () => {
      try {
        const response = await fetch('http://localhost:4000/admin/parents');
        const data = await response.json();
        const formattedData = data.map(parent => ({
          id: parent._id,
          motherorGuardianName: parent.motherorGuardianName,
          motherorGuardianNIC: parent.motherorGuardianNIC,
          Address: parent.Address,
          PostalCode: parent.PostalCode,
          guardianEmail: parent.guardianEmail,
          guardianTelephoneNumber: parent.guardianTelephoneNumber,
          username: parent.username,
          additionalInfo: parent.additionalInfo || '',
        }));
        setRows(formattedData);
      } catch (error) {
        console.error('Error fetching parent data:', error);
      }
    };

    fetchParents();
  }, []);

  return (
    <div>
      <LANavbar />
      <div className="user-page">
        <BGRectangle />
        <section className="image-placeholder">
          <HAdminDashBoard />
          <div className="label-text">
            <div className="minheight">
              <div className="default-slot">
                <h1 className="page-header">Parent Collection</h1>
              </div>

              <div className="card">
                <div className="paper">
                  <div className="custom-users-management-tabl" >
                    <div className="custom-table-toolbar">

                      <div className="queries" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>

                        <div >
                          <Button href="/hupdate-perant"
                            disableElevation={true}
                            variant="contained"
                            sx={{
                              marginTop: "20px",

                              extTransform: "none",
                              color: "#1d2130",
                              fontSize: "14px",
                              background: "#fff9c7",
                              borderRadius: "10x 10px 10px 10px",
                              borderColor: "black",
                              borderWidth: "2px",
                              borderStyle: "solid",
                              "&:hover": { background: "#fff" },
                              width: 300,

                            }}>Update and delete Parents</Button>

                          <div style={{ marginTop: "20px", marginBottom: "20px" }}>
                            <Button href="/hupdate-child"
                              disableElevation={true}
                              variant="contained"
                              sx={{

                                extTransform: "none",

                                color: "#1d2130",
                                fontSize: "14px",
                                background: "#fff9c7",
                                borderRadius: "10x 10px 10px 10px",
                                borderColor: "black",
                                borderWidth: "2px",
                                borderStyle: "solid",
                                "&:hover": { background: "#fff" },
                                width: 300,

                              }}>Update and delete child</Button>
                          </div>

                          <div style={{ marginBottom: "20px" }}>
                            <Button href="/update-proffession"
                              disableElevation={true}
                              variant="contained"
                              sx={{
                                extTransform: "none",
                                color: "#1d2130",
                                fontSize: "14px",
                                background: "#fff9c7",
                                borderRadius: "10x 10px 10px 10px",
                                borderColor: "black",
                                borderWidth: "2px",
                                borderStyle: "solid",
                                "&:hover": { background: "#fff" },
                                width: 300,

                              }}>Update and delete Professionals</Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* right section */}
          <div className="text-container" style={{ marginTop: "50px" }}>
            <div className="desktopdatepicker-parent" >
              <div className="go-to-calendar" style={{ marginTop: "-30px" }} >
                <div className="list">
                  <div className="header-picker">
                    <DesktopDatePicker />
                  </div>
                </div>
              </div>

              {/* <div className="go-to-calendar" style={{ height: "130px", marginTop: "60px", marginBottom: "150px" }}>
                <div className="list" >
                  <div className="header">
                    <div className="span">NOTIFICATIONS</div>
                  </div>

                  <ANotificationList /></div>
              </div> */}
            </div>
          </div>

        </section>


        <div className="table" style={{ marginBottom: "50px", marginLeft: "50px", marginRight: "50px", backgroundColor: "#fff9c7" }}>
          <div style={{ height: 500, width: '100%' }}>
            <DataGrid
              rows={rows}
              columns={columns}
              pageSize={12}
              rowsPerPageOptions={[12]}
              checkboxSelection
              disableSelectionOnClick
            />
          </div>
        </div>

        <Footer />
      </div>
    </div>
  );
};

export default HighAdminChild;
