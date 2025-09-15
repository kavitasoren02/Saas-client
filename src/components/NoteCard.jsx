const NoteCard = ({ note, onEdit, onDelete, canEdit }) => {
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        })
    }

    const truncateContent = (content, maxLength = 150) => {
        if (content.length <= maxLength) return content
        return content.substring(0, maxLength) + "..."
    }

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div className="px-6 py-4">
                <div className="flex justify-between items-start mb-3">
                    <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">{note.title}</h3>
                    {canEdit && (
                        <div className="flex space-x-2 ml-2">
                            <button
                                onClick={() => onEdit(note)}
                                className="text-blue-600 hover:text-blue-800 text-sm"
                                title="Edit note"
                            >
                                Edit
                            </button>
                            <button
                                onClick={() => onDelete(note._id)}
                                className="text-red-600 hover:text-red-800 text-sm"
                                title="Delete note"
                            >
                                Delete
                            </button>
                        </div>
                    )}
                </div>

                <p className="text-gray-600 text-sm mb-4 leading-relaxed">{truncateContent(note.content)}</p>

                <div className="flex justify-between items-center text-xs text-gray-500">
                    <span>By {note.userId.email}</span>
                    <span>{formatDate(note.createdAt)}</span>
                </div>
            </div>
        </div>
    )
}

export default NoteCard
