
import { useNavigate } from 'react-router-dom';
import { PlusCircle, Inbox } from 'lucide-react';
import './emptyFlashCard.css'

interface EmptyFlashcardProps {
  categoryId: number | null;
  categoryName?: string;
}

const EmptyFlashcard =  ({ categoryId, categoryName } : EmptyFlashcardProps) => {
  const navigate = useNavigate();

  const handleAddVocab = () => {
    // Điều hướng sang trang add_vocab. 
    // Bạn có thể truyền categoryId qua Query string (?category=id) hoặc State của Router
    if (categoryId) {
       navigate(`/course/add_vocab?category=${categoryId}`); 
    } else {
       navigate('/course/add_vocab');
    }
  };

  return (
    <div className="empty-flashcard-container">
      <div className="empty-flashcard-content">
        <div className="empty-icon-wrapper">
          {/* Icon chiếc hộp rỗng */}
          <Inbox size={64} className="empty-icon" />
        </div>
        
        <h2 className="empty-title">
          {categoryName ? `Chưa có từ vựng nào trong "${categoryName}"` : "Chủ đề này đang trống!"}
        </h2>
        
        <p className="empty-description">
          Hãy thêm những từ vựng đầu tiên để chuẩn bị cho quá trình ôn luyện và mở rộng vốn từ của bạn nhé.
        </p>

        <button className="add-vocab-btn" onClick={handleAddVocab}>
          <PlusCircle size={20} className="add-vocab-icon" />
          <span>Thêm từ vựng ngay</span>
        </button>
      </div>
    </div>
  );
};

export default EmptyFlashcard;
