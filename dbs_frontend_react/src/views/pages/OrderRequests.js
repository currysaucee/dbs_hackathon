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
  CFormCheck,
  CCardHeader,
  CCallout
} from '@coreui/react';
import { io } from 'socket.io-client'; 
import config from '../../config';
import Checkbox from '../../components/checkbox';

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
  var [checked, setChecked] = useState([]) 
  const trueValue = true
  const falseValue = false
    // setBoolChecked(Array(boolChecked.length).fill(0))

    const onSubmitBulkRequest = (accept_or_reject) => {
        console.log(accept_or_reject)
        for (let i = 0; i < checked.length; i++) {
            const row = checked[i]
            console.log(row, 'onSubmitBulkRequest')
            if (Boolean(accept_or_reject)) {
                console.log('handling accept')
                handleAccept(row)
            } else {
                console.log('handling reject')
                handleReject(row) 
            }
        }
    }

  const addToast = (color, message) => {
    const newToast = { id: Date.now(), color, message };
    setToasts([...toasts, newToast]);

    setTimeout(() => {
      setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== newToast.id));
    }, 3000);
  };

  const handleCheckboxStatus = (isChecked, row) => {
    console.log('Checkbox is now:', isChecked ? 'Checked' : 'Unchecked');
    if (!isChecked) {
        checked = checked.filter(item => item !== row);
    } else {
        if (!checked.includes(row)) {
            checked.push(row);
          }
    }
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
    try{
      const response = await fetch(`${config.API_BASE_URL}/${config.ACCEPT_TRADE_ENDPOINT}`, {
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
      console.log("got error with accept trade for", row)
      addToast('danger', `Error accepting trade: Please contact admin for this`);
    }
  }

  const handleReject = async (row) => {
    console.log(row)
    try{
      const response = await fetch(`${config.API_BASE_URL}/${config.REJECT_TRADE_ENDPOINT}`, {
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
      console.log("got error with reject trade for", row)
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
        <CCardHeader>Approve/Reject Requests</CCardHeader>
        <CCallout>Click on all the checkboxes to select requests to accept</CCallout>
        <CButton
                      size="sm"
                      color="success"
                      onClick={() => onSubmitBulkRequest(trueValue)}
                      >
                    ACCEPT
                    </CButton>      
                    <CButton
                      size="sm"
                      color="danger"
                      onClick={() => onSubmitBulkRequest(falseValue)}
                      >
                    REJECT
                    </CButton>      
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
                  <Checkbox label="" onChangeParent = {handleCheckboxStatus} row = {row}/>
                    
                  {columns.map((col, colIndex) => (
                    <CTableDataCell key={colIndex}>{row[col]}</CTableDataCell>
                  ))}
                    
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