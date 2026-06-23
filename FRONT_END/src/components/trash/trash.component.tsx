import { Delete, Recycle } from "lucide-react"
import './trash.component.css'

export interface cateTrashProps {
    data: {
        id: number,
        name: string,
        deletedAt: string
    }[]
}

export default function TrashComponent({ data }: cateTrashProps) {
    return (
        <div className="profile-container-trash">
            {
                data.map((crm) => <div className="profile-each-container-trash" key={crm.id}>
                    <p className="trash-name">
                        {crm.name}
                    </p>
                    <div className="trashtime-and-actions">
                        <span className="trash-time-removed">
                            {new Date(crm.deletedAt).toLocaleDateString('vi-VN')}
                        </span>
                        <button type="button">
                            <Recycle />
                        </button>
                        <button type="button">
                            <Delete />
                        </button>
                    </div>
                </div>)
            }
        </div>
    )
}