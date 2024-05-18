import { FunctionComponent } from "preact";
import { useEffect, useState } from "preact/hooks";
import { Film, Project} from "../types.ts";

type DeleteFilmProps = {
    projectName:string,
    filmId:string
}

const DeleteFilm: FunctionComponent<DeleteFilmProps> = ({projectName, filmId}) => {
    const [showModal, setShowModal] = useState(false);

    

    const deleteFilm = () => {
        const cookies = document.cookie.split(";");

        const projects = cookies.find(cookie => cookie.startsWith("projects"));

        if(projects){
            const projectsArray = projects.split("=")[1];
            const projectsParsed = JSON.parse(projectsArray);
            const project:Project = projectsParsed.find((project: Project) => project.name === projectName);
            const newFilms = project.films.filter((film: string) => film !== filmId);
            project.films = newFilms;

            //si ya no quedan films, borramos el proyecto

            if(newFilms.length === 0){
                const newProjects = projectsParsed.filter((project: Project) => project.name !== projectName);
                if(newProjects.length === 0){
                    document.cookie = `projects=; path=/; expires=Thu, 01 Jan 1970 00:00:01 UTC;`;
                }else{
                    document.cookie = `projects=${JSON.stringify(newProjects)}; path=/`;
                }
            }
            else{
                document.cookie = `projects=${JSON.stringify(projectsParsed)}; path=/`;
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
            <button onClick={openModal}>Eliminar film</button> 
            {showModal && (
                <div className="modal">
                    <div className="modal-content">
                        <h2>¿Estás seguro de que quieres eliminar el film?</h2>
                        <button onClick={deleteFilm}>Sí</button>
                        &emsp;
                        <button onClick={closeModal}>No</button>
                    </div>
                </div>
            )}
        </div>
    )
}

export default DeleteFilm;