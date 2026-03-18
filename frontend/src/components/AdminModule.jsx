import './Admin.css';
import { Link , useNavigate} from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";


function AdminModule() {
    const [modules, setModules] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [currentId, setCurrentId] = useState(null);
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");    

useEffect(() => {
     axios.get("/api/modules").then((res) => {
          setModules(Array.isArray(res.data) ? res.data : []);
     });
}, []);


// model connect backend
const handleSubmit = async () => {
    try {
        if (isEdit) {
            // UPDATE
            const res = await axios.put(`/api/modules/${currentId}`, {
                name: name,
                description: description
            });

            // 更新 UI（替换那一笔）
            const updated = modules.map((m) =>
                m.id === currentId
                    ? { ...m, name: name, description: description, slug: res.data.slug }
                    : m
            );

            setModules(updated);

            } else {
            const res = await axios.post("/api/modules", {
                name: name,
                description: description
            });
            // 更新 UI
            setModules([...modules, res.data]);
            }
            // reset
            setShowModal(false);
            setIsEdit(false);
            setName("");
            setDescription("");

        } catch (err) {
            console.error(err);
        }
    };
    
    //delete function
    const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete?");

    if (!confirmDelete) return;

    try {
        await fetch(`http://127.0.0.1:8000/api/modules/${id}`, {
            method: "DELETE",
        });

        // 删除后更新 UI（很重要）
        setModules(modules.filter(m => m.id !== id));

    } catch (error) {
        console.error("Delete failed:", error);
    }
};

const closeModal = () => {
    setShowModal(false);
  };


    return (
    <div className='adminmodule'>
    <h1>Module Management</h1>
    <button className='join-module-button' onClick={() => setShowModal(true)}>Add Module</button>
    <br /><br />
    {modules.length === 0 ? (
                    <div className="admin-module-card">
                        <div className="module-row">
                            <h1 className="module-row-header">No modules found</h1>
                            <p className="module-row-description">
                                Your table returned an empty list.
                            </p>
                        </div>
                    </div>
                ) : (
                    modules.map((m) => (
                        <div key={m.id}>
                        <Link to={`/admin/${m.slug}`} className="module-link-wrapper">
                            <br />
                            <div className="admin-module-card">
                                <div className="module-row">
                                    <h1 className="module-row-header">{m.name}</h1>
                                </div>
                            </div>
                        </Link> 
            <br />
            <div className="button-row">
                <button className='edit-button'
                    onClick={(e) => {
                        e.preventDefault(); // 防止 Link 跳页

                        setIsEdit(true);
                        setShowModal(true);

                        setCurrentId(m.id);
                        setName(m.name);
                        setDescription(m.description); 
                    }}
                >Edit</button> &nbsp; &nbsp;
                <button className='delete-button'
                onClick={(e) => {
                    e.preventDefault();
                    handleDelete(m.id);
                    }}>Delete</button>
                </div>
            </div>
            ))                    
        )}
        {/* Modal for user */}
        {showModal && (
        <div className="modal-overlay">
            <div className="modal-box">
                <div className="modal-box-header">
                    <h2 className="edit-module">{isEdit ? "Edit Module" : "Add Module"}</h2>
                    <button className="close-button" onClick={closeModal}>X</button>
                </div>
                <br />
                <input
                    type="text"
                    placeholder="Module Name"
                    className="module-name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />

                <input
                    type="text"
                    placeholder="Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />

                <br /><br />

                <button className="submit-button" onClick={handleSubmit}>Submit</button> &nbsp;
                <button className="cancel-button" onClick={() => setShowModal(false)}>Cancel</button>
            </div>
        </div>
        )}
    </div>
  );
}

export default AdminModule;