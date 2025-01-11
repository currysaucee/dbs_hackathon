/* eslint-disable prettier/prettier */
import React, { useState, useEffect } from 'react';
import {
  CContainer,
  CCard,
  CCardBody,
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CButton,
  CToast,
  CToastBody,
  CToastClose,
  CToaster,
  CRow,
  CCol,
  CFormCheck
} from '@coreui/react';
import { io } from 'socket.io-client'; 
import config from '../../config';

const OrderRequests = () => {
  console.log("Table page is loaded");
  const [data, setData] = useState([]);
  const [columns, setColumns] = useState([]);
  const [toasts, setToasts] = useState([]);
  const [newRowId, setNewRowId] = useState(null); 
  const [sortColumn, setSortColumn] = useState('timestamp');
  const [accountBalance, setAccountBalance] = useState(config.MOCK_ACCOUNT_BALANCE);
  const [accountName, setAccountName] = useState(config.MOCK_ACCOUNT_NAME);
  const [carbonCredit, setCarbonCredit] = useState(config.MOCK_CARBON_CREDIT);
  const [sortDirection, setSortDirection] = useState('desc');

  const addToast = (color, message) => {
    const newToast = { id: Date.now(), color, message };
    setToasts([...toasts, newToast]);

    setTimeout(() => {
      setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== newToast.id));
    }, 3000);
  };

  useEffect(() => {
    const fetchCompanyDetails = async () => {
      try {
        const response = await fetch(`${config.API_BASE_URL}/${config.ACCOUNT_ENDPOINT}`);
        const result = await response.json();

        if (result && result.length > 0) {
          setAccountBalance(result.account_balance)
          setCarbonCredit(result.account_carbon_credit)
          setAccountName(result.account_name)
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchCompanyDetails();
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${config.API_BASE_URL}/${config.MOCK_DATA_ENDPOINT}`);
        const result = await response.json();

        if (result && result.length > 0) {
          setColumns(Object.keys(result[0]));
          
          const sortedData = result.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
          setData(sortedData); 
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();

    const socket = io(config.SOCKET_BASE_URL);
    socket.on('new_trade', (newTrade) => {
      console.log('New trade received:', newTrade);
      setNewRowId(newTrade.uuid || newTrade.id); 
      setData((prevData) => {
        const updatedData = [newTrade, ...prevData];
        return updatedData.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
      });
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const handleAccept = async (row) => {
    console.log(row)
    try{
      const response = await fetch(`${config.API_BASE_URL}/${config.ACCEPT_ORDER_ENDPOINT}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: row.id,
        }),
      });
      const result = await response.json();
      if (response.ok) {
        addToast('success', 'Trade successfully accepted!');
      } else {
        addToast('danger', `Error accepting trade: ${result.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.log("got error")
      addToast('danger', `Error accepting trade: Please contact admin for this`);
    }
  }

  const handleReject = async (row) => {
    console.log(row)
    try{
      const response = await fetch(`${config.API_BASE_URL}/${config.REJECT_ORDER_ENDPOINT}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: row.id,
        }),
      });
      const result = await response.json();
      if (response.ok) {
        addToast('success', 'Trade successfully rejected!');
      } else {
        addToast('danger', `Error rejecting trade: ${result.error || 'Unknown error'}`);
      }
    } catch (error) {
      addToast('danger', `Error rejecting trade: Please contact admin for this`);
    }
  }

  const handleSort = (column) => {
    if (sortColumn === column) {
      setSortDirection((prevDirection) => (prevDirection === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }

    const sortedData = [...data].sort((a, b) => {
      if (column === 'timestamp') {
        // Special handling for timestamp
        return sortDirection === 'asc'
          ? new Date(a.timestamp) - new Date(b.timestamp)
          : new Date(b.timestamp) - new Date(a.timestamp);
      }

      if (a[column] < b[column]) return sortDirection === 'asc' ? -1 : 1;
      if (a[column] > b[column]) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
    setData(sortedData);
  };

  return (
    <CContainer>
      <CCard>
        <CCardBody>            
          <CTable striped hover>
            <CTableHead>
              <CTableRow>
                {columns.map((col, index) => (
                  <CTableHeaderCell key={index}>
                    {col}
                    <CButton
                      size="sm"
                      color="link"
                      onClick={() => handleSort(col)}
                      style={{ textDecoration: 'none' }}
                    >
                      {sortColumn === col ? (sortDirection === 'asc' ? '↑' : '↓') : '↕'}
                    </CButton>
                  </CTableHeaderCell>
                ))}
                <CTableHeaderCell>
                  Action
                </CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {data.map((row, rowIndex) => (
                <CTableRow
                  key={rowIndex}
                  className={newRowId === row.uuid || newRowId === row.id ? 'highlight-row' : ''}
                >
                  <CFormCheck id="defaultCheck1" label="" />

                    
                  {columns.map((col, colIndex) => (
                    <CTableDataCell key={colIndex}>{row[col]}</CTableDataCell>
                  ))}
                    <CTableDataCell>
                    <CButton
                      size="sm"
                      color="success"
                      onClick={() => handleAccept(row)}
                      >
                    ACCEPT
                    </CButton>
                    <CButton
                      size="sm"
                      color="danger"
                      onClick={() => handleReject(row)}
                    >
                    REJECT
                    </CButton>
                  </CTableDataCell>
                </CTableRow>
              ))}
            </CTableBody>
          </CTable>
        </CCardBody>
      </CCard>
      <CToaster
        placement="top-end"
        style={{
          marginTop: '20px',
          marginRight: '20px',
        }}
      >
        {toasts.map((toast) => (
          <CToast key={toast.id} autohide={true} visible={true} color={toast.color}>
            <CToastBody>
              {toast.message}
              <CToastClose onClick={() => setToasts((prev) => prev.filter((t) => t.id !== toast.id))} />
            </CToastBody>
          </CToast>
        ))}
      </CToaster>
    </CContainer>
  );
};

export default OrderRequests;