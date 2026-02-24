const ProjectCard = ({ project, onEdit, onDelete }) => {
  return (
    <div className="project-card">
      <h3>{project.title}</h3>
      <p><b>Domain:</b> {project.domain}</p>
      <p>{project.description}</p>
      <div className="progress-bar">
        <div
          className="progress"
          style={{ width: `${project.progress}%` }}
        >
          {project.progress}%
        </div>
      </div>
      <div className="card-buttons">
        <button onClick={() => onEdit(project)}>Edit</button>
        <button onClick={() => onDelete(project.id)}>Delete</button>
      </div>
    </div>
  );
};

export default ProjectCard;