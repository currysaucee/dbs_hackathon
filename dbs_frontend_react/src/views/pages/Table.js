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
} from '@coreui/react';
import { io } from 'socket.io-client'; 
import config from '../../config';

const Table = () => {
  console.log("Table page is loaded"); 
  const [data, setData] = useState([]); 
  const [columns, setColumns] = useState([]);
  const [newRowId, setNewRowId] = useState(null); 
  const [sortColumn, setSortColumn] = useState('timestamp');
  const [sortDirection, setSortDirection] = useState('desc');

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
          <h3>Dynamic Data Table</h3>
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
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {data.map((row, rowIndex) => (
                <CTableRow
                  key={rowIndex}
                  className={newRowId === row.uuid || newRowId === row.id ? 'highlight-row' : ''}
                >
                  {columns.map((col, colIndex) => (
                    <CTableDataCell key={colIndex}>{row[col]}</CTableDataCell>
                  ))}
                </CTableRow>
              ))}
            </CTableBody>
          </CTable>
        </CCardBody>
      </CCard>
    </CContainer>
  );
};

export default Table;
