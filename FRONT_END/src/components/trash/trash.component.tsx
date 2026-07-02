import { RotateCcw, Trash2 } from "lucide-react"
import './trash.component.css'

export interface cateTrashProps {
    
        id: number,
        name: string,
        deletedAt: string
    
}

export interface TrashProps {
    data : cateTrashProps[]
    onDeletePermenenceCategory : (categoryId : number)=> void
    onRestoreCategory : (categoryId : number)=> void
}

export default function TrashComponent({ data, onRestoreCategory, onDeletePermenenceCategory }: TrashProps) {
    if(data.length === 0) return (
        <div className="trash-empty-state">
            <Trash2 size={44} className="trash-empty-icon" />
            <p className="trash-empty-text">Thùng rác trống</p>
            <p className="trash-empty-subtext">Không có danh mục nào đã bị xóa gần đây.</p>
        </div>
    )


    return (
        <div className="profile-container-trash">
            {
                data.map((crm) => (
                    <div className="profile-each-container-trash" key={crm.id}>
                        <div className="trash-info-left">
                            <p className="trash-name">{crm.name}</p>
                            <span className="trash-time-removed">
                                Đã xóa: {new Date(crm.deletedAt).toLocaleDateString('vi-VN')}
                            </span>
                        </div>
                        <div className="trash-actions">
                            <button type="button" className="btn-restore" title="Khôi phục" onClick={() => onRestoreCategory(crm.id)}>
                                <RotateCcw size={16} />
                            </button>
                            <button type="button" className="btn-delete-perm" title="Xóa vĩnh viễn" onClick={()=> onDeletePermenenceCategory(crm.id)}>
                                <Trash2 size={16} />
                            </button>
                        </div>
                    </div>
                ))
            }
        </div>
    )
}