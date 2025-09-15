import { useState, useEffect } from "react"
import { useAuth } from "../contexts/AuthContext"
import NoteCard from "../components/NoteCard"
import NoteModal from "../components/NoteModal"

const Notes = () => {
    const { user, getAuthHeaders, API_BASE_URL } = useAuth()
    const [notes, setNotes] = useState([])
    const [loading, setLoading] = useState(true)
    const [showModal, setShowModal] = useState(false)
    const [editingNote, setEditingNote] = useState(null)
    const [searchTerm, setSearchTerm] = useState("")
    const [error, setError] = useState("")

    useEffect(() => {
        fetchNotes()
    }, [searchTerm])

    const fetchNotes = async () => {
        try {
            const url = new URL(`${API_BASE_URL}/notes`)
            if (searchTerm) {
                url.searchParams.append("search", searchTerm)
            }

            const response = await fetch(url, {
                headers: getAuthHeaders(),
            })

            if (response.ok) {
                const data = await response.json()
                setNotes(data.notes)
            } else {
                setError("Failed to fetch notes")
            }
        } catch (error) {
            console.error("Failed to fetch notes:", error)
            setError("Network error")
        } finally {
            setLoading(false)
        }
    }

    const handleCreateNote = () => {
        setEditingNote(null)
        setShowModal(true)
    }

    const handleEditNote = (note) => {
        setEditingNote(note)
        setShowModal(true)
    }

    const handleDeleteNote = async (noteId) => {
        if (!confirm("Are you sure you want to delete this note?")) {
            return
        }

        try {
            const response = await fetch(`${API_BASE_URL}/notes/${noteId}`, {
                method: "DELETE",
                headers: getAuthHeaders(),
            })

            if (response.ok) {
                setNotes(notes.filter((note) => note._id !== noteId))
            } else {
                const data = await response.json()
                alert(data.error || "Failed to delete note")
            }
        } catch (error) {
            console.error("Failed to delete note:", error)
            alert("Network error")
        }
    }

    const handleSaveNote = async (noteData) => {
        try {
            const isEditing = editingNote !== null
            const url = isEditing ? `${API_BASE_URL}/notes/${editingNote._id}` : `${API_BASE_URL}/notes`

            const response = await fetch(url, {
                method: isEditing ? "PUT" : "POST",
                headers: {
                    "Content-Type": "application/json",
                    ...getAuthHeaders(),
                },
                body: JSON.stringify(noteData),
            })

            const data = await response.json()

            if (response.ok) {
                if (isEditing) {
                    setNotes(notes.map((note) => (note._id === editingNote._id ? data.note : note)))
                } else {
                    setNotes([data.note, ...notes])
                }
                setShowModal(false)
                setEditingNote(null)
            } else {
                if (response.status === 403 && data.error === "Note limit reached") {
                    alert(`${data.message}\n\nCurrent: ${data.current}/${data.limit} notes`)
                } else {
                    alert(data.error || "Failed to save note")
                }
            }
        } catch (error) {
            console.error("Failed to save note:", error)
            alert("Network error")
        }
    }

    const isFreePlan = user?.tenant?.plan === "free"
    const noteCount = notes.length
    const maxNotes = user?.tenant?.maxNotes
    const canCreateNote = maxNotes === -1 || noteCount < maxNotes

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-900">Notes</h1>
                <button
                    onClick={handleCreateNote}
                    disabled={!canCreateNote}
                    className={`${canCreateNote ? "inline-flex items-center justify-center px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700" : "inline-flex items-center justify-center px-3 py-2 rounded-md bg-gray-100 text-gray-900 hover:bg-gray-200"}`}
                    title={!canCreateNote ? "Note limit reached. Upgrade to Pro for unlimited notes." : ""}
                >
                    Create Note
                </button>
            </div>

            {/* Plan Status */}
            {isFreePlan && (
                <div className="px-4 py-3 rounded-lg text-sm bg-yellow-50 text-yellow-800 border border-yellow-200">
                    <div className="flex justify-between items-center">
                        <span>
                            Free Plan: {noteCount}/{maxNotes} notes used
                            {!canCreateNote && " - Limit reached!"}
                        </span>
                        {user?.role === "admin" && <span className="text-sm">Upgrade to Pro for unlimited notes</span>}
                    </div>
                </div>
            )}

            {/* Search */}
            <div className="max-w-md">
                <input
                    type="text"
                    placeholder="Search notes..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {/* Error Message */}
            {error && <div className="alert alert-error">{error}</div>}

            {/* Notes Grid */}
            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[...Array(6)].map((_, i) => (
                        <div key={i} className="bg-white rounded-lg shadow-sm border border-gray-200 animate-pulse">
                            <div className="px-6 py-4">
                                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                                <div className="h-3 bg-gray-200 rounded w-full mb-1"></div>
                                <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : notes.length === 0 ? (
                <div className="text-center py-12">
                    <div className="text-gray-500 text-lg mb-4">
                        {searchTerm ? "No notes found matching your search." : "No notes yet."}
                    </div>
                    {!searchTerm && canCreateNote && (
                        <button onClick={handleCreateNote} className="inline-flex items-center justify-center px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700">
                            Create your first note
                        </button>
                    )}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {notes.map((note) => (
                        <NoteCard
                            key={note._id}
                            note={note}
                            onEdit={handleEditNote}
                            onDelete={handleDeleteNote}
                            canEdit={note.userId._id === user.id || user.role === "admin"}
                        />
                    ))}
                </div>
            )}

            {/* Note Modal */}
            {showModal && (
                <NoteModal
                    note={editingNote}
                    onSave={handleSaveNote}
                    onClose={() => {
                        setShowModal(false)
                        setEditingNote(null)
                    }}
                />
            )}
        </div>
    )
}

export default Notes
