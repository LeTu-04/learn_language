main_content 
.footerofcard
{
    display: flex;
    flex-direction: row;
    justify-content:space-between;
    /* khoảng cách giữa text và icon */
    gap: 8px;
    /* căn giữa theo chiều dọc */
    align-items: center;
    /* overflow-wrap: break-word; */
 } 

.example {
    /* không xuống dòng */
    white-space: nowrap; 
    /* ẩn phần text tràn  */
    overflow: hidden;
    text-overflow: ellipsis;
    font-family :'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
    cursor: pointer;
}

.example.expanded {
    /* cho phép xuống dòng */
    white-space: normal;
    overflow: visible;
}

.trashIconRemoveV {
    flex-shrink: 0; /*ngăn icon bị co lại */
    cursor: pointer;
    color: red;
}

.trashIconRemoveV:hover {
    color: darkred;
}

.headerofcard {
    flex-shrink: 0;


}

.vocabulary-list {
    /* chiếm toàn bộ khoảng trống còn lại trong container */
    flex: 1; 
    overflow-y: auto;
}


.vocabulary-list::-webkit-scrollbar {
  width: 6px;
}

.vocabulary-list::-webkit-scrollbar-track {
  background: transparent;
}

.vocabulary-list::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.2);
  border-radius: 10px;
}

.vocabulary-list::-webkit-scrollbar-thumb:hover {
  background: rgba(0, 0, 0, 0.4);
}




sidebar 
.Category {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    border-radius: 5px;
    margin: 10px 0px;

    padding-left: 10px;
    padding-right: 10px;

    overflow: hidden;

}

.Category.currentCategory {
    background-color: blue;
}

.Category h3 {
    flex: 1;
    min-width: 0;


    font-size: 17px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    max-width: 100%;

}
.Category:hover {
    cursor: pointer;
    background-color: rgb(133, 167, 221);
}


.category-edit-input {
    width: 220px;
    padding: 6px 10px;
    font-size: 14px;
    border: 1px solid #4a90e2;
    border-radius: 4px;
    outline: none;
    box-sizing: border-box;
}

.category-edit-input:focus {
    border-color: #2e6fba;
    box-shadow: 0 0 0 2px rgba(74, 144, 226, 0.2);
}


.action {
    margin-left: 10px;
    display: flex;
    flex-direction: row;
    flex-shrink: 0; /*ko cho icon co lại*/
}

.pen {
    margin-right: 10px;
}

.pen:hover {
    cursor: pointer;
    background: grey;
    border-radius: 50%;
}

.trash:hover {
    cursor: pointer;
    background-color: grey;
    border-radius: 50%;
}