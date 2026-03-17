import  { useState } from 'react';
import './flash_card.css'; // Nhúng file CSS ở trên vào

export default function Flashcard({ word = 'a', meaning = 'a', example = 'a' }) {
  // Trạng thái lật thẻ: false = mặt trước (Word), true = mặt sau (Meaning)
  const [isFlipped, setIsFlipped] = useState(false);

  // Hàm xử lý sự kiện click
  const handleFlip = () => {
    setIsFlipped(!isFlipped); // Đảo ngược trạng thái
  };

  return (
    <div className="flashcard-container" onClick={handleFlip}>
      {/* Nếu isFlipped là true, thêm class 'is-flipped' để CSS quay thẻ 180 độ */}
      <div className={`flashcard-inner ${isFlipped ? 'is-flipped' : ''}`}>
        
        {/* MẶT TRƯỚC */}
        <div className="flashcard-front">
          <h2>{word}</h2>
          <p style={{ color: 'gray' }}>Chạm để xem nghĩa</p>
        </div>

        {/* MẶT SAU */}
        <div className="flashcard-back">
          <h2>{meaning}</h2>
          {example && (
            <p style={{ fontStyle: 'italic', marginTop: '10px' }}>
              "{example}"
            </p>
          )}
        </div>

      </div>
    </div>
  );
}