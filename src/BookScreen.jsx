import { useState, useEffect } from 'react';
import { Spin, Pagination, Modal, ConfigProvider, theme } from 'antd';
import axios from 'axios';

// Import Component ที่เราแยกไว้
import Navbar from './components/Navbar';
import BookList from './components/BookList'; // เช็คชื่อไฟล์ดีๆนะครับ (BookList หรือ Booklist)
import EditBook from './components/EditBook';
import NewBookForm from './components/NewBookForm'; // Import ฟอร์มใหม่ (สังเกตชื่อไฟล์ที่คุณตั้ง NewBookFrom)

const URL_BOOK = "/api/book";
const URL_CATEGORY = "/api/book-category";

function BookScreen({ onLogout, toggleTheme, isDarkMode }) {
  const [bookData, setBookData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [editBook, setEditBook] = useState(null);

  // State สำหรับ Popup New Book
  const [isModalOpen, setIsModalOpen] = useState(false);
  // --- [PAGINATION STATE] ---
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  // ... (ฟังก์ชัน fetchCategories, fetchBooks เหมือนเดิม) ...
  const fetchCategories = async () => { /* ...codeเดิม... */ 
      try {
        const response = await axios.get(URL_CATEGORY);
        setCategories(response.data.map(cat => ({ label: cat.name, value: cat.id })));
      } catch (error) { console.error(error); }
  }

  const fetchBooks = async () => { /* ...codeเดิม... */ 
      setLoading(true);
      try {
        const response = await axios.get(URL_BOOK);
        setBookData(response.data);
      } catch (error) { console.error(error); } finally { setLoading(false); }
  }

  // แก้ไข handleAddBook ให้รับค่าจาก Form ใหม่
  const handleAddBook = async (book) => {
    setLoading(true);
    try {
      await axios.post(URL_BOOK, book);
      await fetchBooks();
      setIsModalOpen(false); // ปิด Popup เมื่อเสร็จ
    } catch (error) {
      console.error('Error adding book:', error);
    } finally {
      setLoading(false);
    }
  };

  // ... (handleLikeBook, handleDeleteBook, handleEditBook เหมือนเดิม) ...
  const handleLikeBook = async (book) => { /* ...codeเดิม... */ 
      try { await axios.patch(URL_BOOK + `/${book.id}`, { likeCount: (book.likeCount || 0) + 1 }); fetchBooks(); } catch(e){} 
  }
  const handleDeleteBook = async (bookId) => { /* ...codeเดิม... */ 
      try { await axios.delete(URL_BOOK + `/${bookId}`); fetchBooks(); } catch(e){}
  }
  const handleEditBook = async (book) => { /* ...codeเดิม... */ 
      try { /* logic เดิม */ await axios.patch(URL_BOOK + `/${book.id}`, book); fetchBooks(); } catch(e){} setEditBook(null);
  }

  useEffect(() => {
    fetchCategories();
    fetchBooks();
  }, []);

  // Pagination Logic
  const indexOfLastBook = currentPage * pageSize;
  const indexOfFirstBook = indexOfLastBook - pageSize;
  const currentBooks = bookData.slice(indexOfFirstBook, indexOfLastBook);

  return (
    // ConfigProvider ครอบเพื่อให้ Theme เปลี่ยนทั้งหน้า
    <ConfigProvider theme={{ algorithm: isDarkMode ? theme.darkAlgorithm : theme.defaultAlgorithm }}>
      <div style={{ 
          minHeight: '100vh',
          display: 'flex',             // 1. จัดแบบ Flex
          flexDirection: 'column',     // 2. เรียงแนวตั้ง
          backgroundColor: isDarkMode ? '#000' : '#fff', 
          color: isDarkMode ? '#fff' : '#000'
      }}>
        
        {/* 1. Navbar อยู่ข้างบนสุด */}
        <Navbar 
          onNewBookClick={() => setIsModalOpen(true)} // เปิด Modal
          toggleTheme={toggleTheme} // สลับธีม
          isDarkMode={isDarkMode}
          onLogout={onLogout}
        />

        <div style={{ padding: '0 20px',flex: 1}}>
          
          {/* ลบ InlineAddBookForm ออกแล้ว เพราะเราไปใช้ปุ่มใน Navbar แทน */}

          <Spin spinning={loading}>
            <BookList 
              data={currentBooks} 
              onLiked={handleLikeBook}
              onDeleted={handleDeleteBook}
              onEdit={book => setEditBook(book)}
            />
          </Spin>

          {/* Pagination */}
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px', paddingBottom: '20px' }}>
            <Pagination 
              current={currentPage} 
              total={bookData.length} 
              pageSize={pageSize}
              onChange={(page) => setCurrentPage(page)} 
              showSizeChanger={false}
            />
          </div>
        </div>

        {/* --- MODAL: New Book --- */}
        <Modal
          title="Add New Book"
          open={isModalOpen}
          onCancel={() => setIsModalOpen(false)}
          footer={null} // ไม่เอาปุ่ม OK/Cancel ของ Modal (ใช้ปุ่มใน Form)
          destroyOnClose
        >
          <NewBookForm categories={categories} onAdd={handleAddBook} />
        </Modal>

        {/* --- MODAL: Edit Book (ของเดิม) --- */}
        <EditBook 
          book={editBook} 
          categories={categories} 
          open={editBook !== null} 
          onCancel={() => setEditBook(null)} 
          onSave={handleEditBook} 
        />

      </div>
    </ConfigProvider>
  );
}

export default BookScreen;