import { useState, useEffect } from "react"

const NoteModal = ({ note, onSave, onClose }) => {
    const [title, setTitle] = useState("")
    const [content, setContent] = useState("")
    const [saving, setSaving] = useState(false)

    useEffect(() => {
        if (note) {
            setTitle(note.title)
            setContent(note.content)
        } else {
            setTitle("")
            setContent("")
        }
    }, [note])

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!title.trim() || !content.trim()) {
            alert("Please fill in both title and content")
            return
        }

        setSaving(true)
        await onSave({ title: title.trim(), content: content.trim() })
        setSaving(false)
    }

    const handleBackdropClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose()
        }
    }

    return (
        <div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            onClick={handleBackdropClick}
        >
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
                <div className="flex justify-between items-center p-6 border-b border-gray-200">
                    <h2 className="text-xl font-semibold text-gray-900">{note ? "Edit Note" : "Create New Note"}</h2>
                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Close"
                        className="text-gray-500 hover:text-gray-700"
                    >
                        ×
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6">
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                                Title
                            </label>
                            <input
                                id="title"
                                type="text"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500"
                                placeholder="Enter note title..."
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                maxLength={200}
                                required
                            />
                            <div className="text-xs text-gray-500 mt-1">{title.length}/200 characters</div>
                        </div>

                        <div>
                            <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
                                Content
                            </label>
                            <textarea
                                id="content"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500 resize-vertical"
                                rows={12}
                                placeholder="Write your note content here..."
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                maxLength={10000}
                                required
                            />
                            <div className="text-xs text-gray-500 mt-1">{content.length}/10,000 characters</div>
                        </div>
                    </div>

                    <div className="flex justify-end space-x-3 mt-6 pt-6 border-t border-gray-200">
                        <button
                            type="button"
                            onClick={onClose}
                            className="inline-flex items-center justify-center px-3 py-2 rounded-md bg-gray-100 text-gray-900 hover:bg-gray-200"
                            disabled={saving}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="inline-flex items-center justify-center px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700"
                            disabled={saving}
                        >
                            {saving ? (
                                <div className="flex items-center">
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                    Saving...
                                </div>
                            ) : note ? (
                                "Update Note"
                            ) : (
                                "Create Note"
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default NoteModal
