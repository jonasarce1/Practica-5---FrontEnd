import { FunctionComponent } from "preact";
import { useEffect, useState } from "preact/hooks";
import { Film, Project} from "../types.ts";

type DeleteProjectProps = {
    projectName:string
}

const DeleteProject: FunctionComponent<DeleteProjectProps> = ({projectName}) => {
    const [showModal, setShowModal] = useState(false);

    const deleteProject = () => {
        const cookies = document.cookie.split(";");

        const projects = cookies.find(cookie => cookie.includes("projects"));

        if(projects){
            const projectsArray = projects.split("=")[1];
            const projectsParsed = JSON.parse(projectsArray);
            const newProjects = projectsParsed.filter((project: Project) => project.name !== projectName);

            //si ya no quedan proyectos, borramos la cookie
            if(newProjects.length === 0){
                document.cookie = `projects=; path=/; expires=Thu, 01 Jan 1970 00:00:01 UTC;`;
            }else{
                document.cookie = `projects=${JSON.stringify(newProjects)}; path=/`;
            }
            closeModal();
            window.location.reload();   
        }
    }

    const openModal = () => {
        setShowModal(true);
    }

    const closeModal = () => {
        setShowModal(false);
    }

    return(
        <div>
            <button className="project-action" onClick={openModal}>Eliminar proyecto</button> 
            {showModal && (
                <div className="modal">
                    <div className="modal-content">
                        <h2>¿Estás seguro de que quieres eliminar el proyecto {projectName}?</h2>
                        <button onClick={deleteProject}>Sí</button>
                        &emsp;
                        <button onClick={closeModal}>No</button>
                    </div>
                </div>
            )}
        </div>
    )
}

export default DeleteProject;