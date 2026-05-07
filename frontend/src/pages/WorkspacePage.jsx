import { useEffect, useState } from "react";
import api from "../api/client";
import { useAuth } from "../context/AuthContext";

const WorkspacePage = () => {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [members, setMembers] = useState([]);
  const [projectForm, setProjectForm] = useState({ name: "", description: "" });
  const [taskForm, setTaskForm] = useState({ title: "", description: "", projectId: "", assignedTo: "", dueDate: "" });
  const [memberForm, setMemberForm] = useState({ projectId: "", memberId: "" });
  const [removeMemberForm, setRemoveMemberForm] = useState({ projectId: "", memberId: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [activeSection, setActiveSection] = useState("projects");
  const selectedProject = projects.find((p) => p._id === taskForm.projectId);
  const assignableMembers = selectedProject?.teamMembers || [];

  const loadData = async () => {
    if (user.role === "Admin") {
      const [projectRes, taskRes, memberRes] = await Promise.all([
        api.get("/projects"),
        api.get("/tasks"),
        api.get("/users")
      ]);
      setProjects(projectRes.data);
      setTasks(taskRes.data);
      setMembers(memberRes.data);
      return;
    }

    const [projectRes, taskRes] = await Promise.all([api.get("/projects"), api.get("/tasks")]);
    setProjects(projectRes.data);
    setTasks(taskRes.data);
  };

  useEffect(() => {
    loadData();
  }, []);

  const createProject = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    try {
      await api.post("/projects", { ...projectForm, teamMembers: [user.id] });
      setProjectForm({ name: "", description: "" });
      setSuccess("Project created successfully");
      loadData();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create project");
    }
  };

  const createTask = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    try {
      await api.post("/tasks", taskForm);
      setTaskForm({ title: "", description: "", projectId: "", assignedTo: "", dueDate: "" });
      setSuccess("Task created successfully");
      loadData();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create task");
    }
  };

  const updateStatus = async (taskId, status) => {
    setError("");
    setSuccess("");
    try {
      await api.patch(`/tasks/${taskId}/status`, { status });
      setSuccess("Task status updated");
      loadData();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update task");
    }
  };

  const updateTaskDeadline = async (taskId, dueDate) => {
    setError("");
    setSuccess("");
    try {
      await api.patch(`/tasks/${taskId}/status`, { dueDate });
      setSuccess("Task deadline updated");
      loadData();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update deadline");
    }
  };

  const addMember = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    try {
      await api.patch(`/projects/${memberForm.projectId}/members`, { memberId: memberForm.memberId });
      setMemberForm({ projectId: "", memberId: "" });
      setSuccess("Member added to project");
      loadData();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add member");
    }
  };

  const removeMember = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    try {
      await api.delete(`/projects/${removeMemberForm.projectId}/members`, {
        data: { memberId: removeMemberForm.memberId }
      });
      setRemoveMemberForm({ projectId: "", memberId: "" });
      setSuccess("Member removed from project");
      loadData();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to remove member");
    }
  };

  const editProject = async (projectId, name, description) => {
    const newName = window.prompt("Enter new project name", name);
    if (!newName) return;
    const newDescription = window.prompt("Enter new project description", description || "") ?? "";
    setError("");
    setSuccess("");
    try {
      await api.patch(`/projects/${projectId}`, { name: newName, description: newDescription });
      setSuccess("Project updated");
      loadData();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update project");
    }
  };

  const deleteProject = async (projectId) => {
    if (!window.confirm("Delete this project? This action cannot be undone.")) return;
    setError("");
    setSuccess("");
    try {
      await api.delete(`/projects/${projectId}`);
      setSuccess("Project deleted");
      loadData();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete project");
    }
  };

  return (
    <div className="grid">
      {error ? <p className="error-text">{error}</p> : null}
      {success ? <p className="success-text">{success}</p> : null}

      <div className="card workspace-menu-card">
        <h2>Workspace Menu</h2>
        <div className="workspace-menu">
          {user.role === "Admin" && (
            <>
              <button type="button" className={activeSection === "projects" ? "workspace-tab active" : "workspace-tab"} onClick={() => setActiveSection("projects")}>Projects</button>
              <button type="button" className={activeSection === "members" ? "workspace-tab active" : "workspace-tab"} onClick={() => setActiveSection("members")}>Members</button>
            </>
          )}
          <button type="button" className={activeSection === "createTask" ? "workspace-tab active" : "workspace-tab"} onClick={() => setActiveSection("createTask")}>Create Task</button>
          <button type="button" className={activeSection === "taskBoard" ? "workspace-tab active" : "workspace-tab"} onClick={() => setActiveSection("taskBoard")}>Task Board</button>
        </div>
      </div>

      {user.role === "Admin" && activeSection === "projects" && (
        <div className="card">
          <h2>Create & Manage Projects</h2>
          <form onSubmit={createProject}>
            <label>Project Name</label>
            <input value={projectForm.name} onChange={(e) => setProjectForm((p) => ({ ...p, name: e.target.value }))} required />
            <label>Description</label>
            <textarea value={projectForm.description} onChange={(e) => setProjectForm((p) => ({ ...p, description: e.target.value }))} />
            <button type="submit">Create Project</button>
          </form>

          {projects.map((project) => (
            <div key={project._id} className="card task-card">
              <h3>{project.name}</h3>
              <p>{project.description || "No description"}</p>
              <p>Members: {(project.teamMembers || []).map((m) => m.name).join(", ")}</p>
              <button type="button" onClick={() => editProject(project._id, project.name, project.description)}>Edit Project</button>
              &nbsp;
              <button type="button" className="logout-btn" onClick={() => deleteProject(project._id)}>Delete Project</button>
            </div>
          ))}
        </div>
      )}

      {user.role === "Admin" && activeSection === "members" && (
        <div className="card">
          <h2>Manage Project Members</h2>
          <form onSubmit={addMember}>
            <label>Select Project</label>
            <select value={memberForm.projectId} onChange={(e) => setMemberForm((p) => ({ ...p, projectId: e.target.value }))} required>
              <option value="">Select project</option>
              {projects.map((p) => (
                <option key={p._id} value={p._id}>{p.name}</option>
              ))}
            </select>
            <label>Add Member (4-digit ID)</label>
            <input
              value={memberForm.memberId}
              onChange={(e) => setMemberForm((p) => ({ ...p, memberId: e.target.value.replace(/\D/g, "").slice(0, 4) }))}
              inputMode="numeric"
              maxLength={4}
              required
            />
            <button type="submit">Add Member</button>
          </form>

          <form onSubmit={removeMember}>
            <label>Select Project</label>
            <select value={removeMemberForm.projectId} onChange={(e) => setRemoveMemberForm((p) => ({ ...p, projectId: e.target.value }))} required>
              <option value="">Select project</option>
              {projects.map((p) => (
                <option key={p._id} value={p._id}>{p.name}</option>
              ))}
            </select>
            <label>Remove Member (4-digit ID)</label>
            <input
              value={removeMemberForm.memberId}
              onChange={(e) => setRemoveMemberForm((p) => ({ ...p, memberId: e.target.value.replace(/\D/g, "").slice(0, 4) }))}
              inputMode="numeric"
              maxLength={4}
              required
            />
            <button type="submit">Remove Member</button>
          </form>

          <div className="card task-card">
            <h3>All Members (Name + Unique ID)</h3>
            {members.length === 0 ? (
              <p>No members found.</p>
            ) : (
              members.map((member) => (
                <p key={member._id}>
                  {member.name} - ID: <strong>{member.memberId || "----"}</strong>
                </p>
              ))
            )}
          </div>
        </div>
      )}

      {activeSection === "createTask" && (
        <div className="card">
          <h2>Create Task</h2>
          <form onSubmit={createTask}>
            <label>Title</label>
            <input value={taskForm.title} onChange={(e) => setTaskForm((p) => ({ ...p, title: e.target.value }))} required />
            <label>Description</label>
            <textarea value={taskForm.description} onChange={(e) => setTaskForm((p) => ({ ...p, description: e.target.value }))} />
            <label>Project</label>
            <select
              value={taskForm.projectId}
              onChange={(e) => setTaskForm((p) => ({ ...p, projectId: e.target.value, assignedTo: "" }))}
              required
            >
              <option value="">Select project</option>
              {projects.map((p) => (
                <option key={p._id} value={p._id}>{p.name}</option>
              ))}
            </select>
            <label>Assign To (Member Name + ID)</label>
            <select
              value={taskForm.assignedTo}
              onChange={(e) => setTaskForm((p) => ({ ...p, assignedTo: e.target.value }))}
              required
              disabled={!taskForm.projectId}
            >
              <option value="">{taskForm.projectId ? "Select member" : "Select project first"}</option>
              {assignableMembers.map((member) => (
                <option key={member._id} value={member.memberId}>
                  {member.name} ({member.memberId || "----"})
                </option>
              ))}
            </select>
            <small className="hint-text">Choose member from selected project's team list.</small>
            <label>Deadline (Date & Time)</label>
            <input type="datetime-local" value={taskForm.dueDate} onChange={(e) => setTaskForm((p) => ({ ...p, dueDate: e.target.value }))} required />
            <button type="submit">Create Task</button>
          </form>
        </div>
      )}

      {activeSection === "taskBoard" && (
        <div className="card">
          <h2>Task Board</h2>
          {tasks.map((task) => (
            <div key={task._id} className="card task-card">
              <h3>{task.title}</h3>
              <p className="task-meta">Status: <strong>{task.status}</strong></p>
              <p>Project: {task.project?.name || "N/A"}</p>
              <p>Assignee: {task.assignedTo?.name || "N/A"}</p>
              <p>Deadline: {new Date(task.dueDate).toLocaleString()}</p>
              <select value={task.status} onChange={(e) => updateStatus(task._id, e.target.value)}>
                <option value="Todo">Todo</option>
                <option value="In Progress">In Progress</option>
                <option value="Done">Done</option>
              </select>
              {user.role === "Admin" && (
                <input
                  type="datetime-local"
                  defaultValue={task.dueDate ? new Date(task.dueDate).toISOString().slice(0, 16) : ""}
                  onBlur={(e) => {
                    if (e.target.value) updateTaskDeadline(task._id, e.target.value);
                  }}
                />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default WorkspacePage;
