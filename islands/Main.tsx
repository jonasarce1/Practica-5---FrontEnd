import { FunctionComponent } from "preact";
import { useEffect, useState } from "preact/hooks";
import { Film, Project} from "../types.ts";
import { useSignal, Signal } from "@preact/signals";

import FiltroMarca from "../components/FiltroMarca.tsx";
import FiltroIso from "../components/FiltroIso.tsx";
import FiltroFormat from "../components/FiltroFormat.tsx";
import FiltroColor from "../components/FiltroColor.tsx";
import FiltroName from "../components/FiltroName.tsx";

const Main: FunctionComponent = () => {
    const [films, setFilms] = useState<Film[]>([]);
    const [brands, setBrands] = useState<string[]>([]);
    const [isos, setIsos] = useState<number[]>([]);
    const [filteredFilms, setFilteredFilms] = useState<Film[]>([]);
    const [showModalMain, setShowModalMain] = useState<boolean>(false);
    const [showModalNewProject, setShowModalNewProject] = useState<boolean>(false);
    const [showModalExistingProject, setShowModalExistingProject] = useState<boolean>(false);
    const [selectedFilm, setSelectedFilm] = useState<Film | null>(null);
    const [existingProjects, setExistingProjects] = useState<Project[]>([]);

    const brandSignal: Signal<string> = useSignal("any");
    const isoSignal: Signal<number> = useSignal(0);
    const formatThirtyFiveSignal: Signal<boolean> = useSignal(false);
    const formatOneTwentySignal: Signal<boolean> = useSignal(false);
    const colorSignal: Signal<boolean> = useSignal(false);
    const nameSignal: Signal<string> = useSignal("");

    useEffect(() => {
        const handler = async () => {
            const data = await fetch("/api");
            const response: Film[] = await data.json();
            setFilms(response);

            const brands: string[] = response.map(film => film.brand);
            const uniqueBrands = Array.from(new Set(brands));
            uniqueBrands.sort();
            setBrands(uniqueBrands);

            const isos: number[] = response.map(film => film.iso);
            const uniqueIsos = Array.from(new Set(isos));
            uniqueIsos.sort((a, b) => a - b);
            setIsos(uniqueIsos);
        }

        handler();
    }, []);

    useEffect(() => {
        const filteredFilms = films.filter(film => {
            const matchesBrand = brandSignal.value === "any" || film.brand === brandSignal.value;
            const matchesIso = isoSignal.value === 0 || film.iso === isoSignal.value;
            const matchesFormat = (!formatThirtyFiveSignal.value && !formatOneTwentySignal.value) ||
                (formatThirtyFiveSignal.value && film.formatThirtyFive) ||
                (formatOneTwentySignal.value && film.formatOneTwenty);

            const matchesColor = !colorSignal.value || film.color;
            const matchesName = nameSignal.value === "" || film.name.toLowerCase().includes(nameSignal.value.toLowerCase());

            return matchesBrand && matchesIso && matchesFormat && matchesColor && matchesName;
        });

        setFilteredFilms(filteredFilms);
    }, [films, brandSignal.value, isoSignal.value, formatThirtyFiveSignal.value, formatOneTwentySignal.value, colorSignal.value, nameSignal.value]);

    const handleAddFilm = (film: Film) => {
        setSelectedFilm(film);
        setShowModalMain(true);
    };

    const handleCloseModalMain = () => {
        setShowModalMain(false);
        setSelectedFilm(null);
    };

    const handleAddFilmNewProject = () => {
        setShowModalMain(false);
        setShowModalNewProject(true);
    }

    const handleCloseModalNewProject = () => {
        setShowModalMain(true);
        setShowModalNewProject(false);
    }

    const handleSubmitNewProject = (event: Event) => {
        event.preventDefault();
    
        const form = event.target as HTMLFormElement;
        const formData = new FormData(form);
        const projectName = formData.get('name') as string;
    
        if (projectName && selectedFilm) {
            const newProject:Project = {
                name: projectName,
                films: [selectedFilm._id]
            };

            //guardamos el proyecto en una cookie para los proyectos
            const cookie = document.cookie;

            const projectCookie = cookie.split(';').find(c => c.startsWith('projects'));

            if(projectCookie){ //si ya hay proyectos guardados
                if(JSON.parse(projectCookie.split('=')[1]).find((project: Project) => project.name === projectName)){
                    alert("Ya existe un proyecto con ese nombre");
                    handleCloseModalNewProject();
                    return;
                }

                const projects = JSON.parse(projectCookie.split('=')[1]);
                projects.push(newProject);
                document.cookie = `projects=${JSON.stringify(projects)}; path=/`;
            }else{ //si no hay proyectos guardados creamos la cookie
                const projects: Project[] = [newProject];
                document.cookie = `projects=${JSON.stringify(projects)}; path=/`;
            }
    
            handleCloseModalNewProject();
        }
    };

    const handleAddFilmExistingProject = () => {
        setShowModalMain(false);
        setShowModalExistingProject(true);

        const cookie = document.cookie;

        const projectCookie = cookie.split(';').find(c => c.startsWith('projects'));

        if(projectCookie){
            const projects = JSON.parse(projectCookie.split('=')[1]);
            if(projects.length > 0){
                setExistingProjects(projects);
                return;
            }
        }
        alert("No hay proyectos existentes");
        setShowModalMain(true);
        setShowModalExistingProject(false);
    }

    const handleCloseModalExistingProject = () => {
        setShowModalMain(true);
        setShowModalExistingProject(false);
    }

    const handleSubmitExistingProject = (event: Event) => {
        event.preventDefault();

        const form = event.target as HTMLFormElement;

        const formData = new FormData(form);

        const selectedProject = formData.get('project') as string;
        
        if(selectedProject && selectedFilm){
            const cookie = document.cookie;

            const projectCookie = cookie.split(';').find(c => c.startsWith('projects'));

            if(projectCookie){
                const projects = JSON.parse(projectCookie.split('=')[1]);

                const project = projects.find((project: Project) => project.name === selectedProject);

                if(project){
                    project.films.push(selectedFilm._id);
                    document.cookie = `projects=${JSON.stringify(projects)}; path=/`;
                }
            }
        }

        setShowModalMain(true);
        setShowModalExistingProject(false);
    }

    return (
        <div className="container">
            <div className="filters">
                <div className="select-container">
                    <FiltroMarca brands={brands} brandSignal={brandSignal} />
                </div>
                <div className="select-container">
                    <FiltroIso isos={isos} isoSignal={isoSignal} />
                </div>
                <div className="select-container">
                    <FiltroFormat formatOneTwentySignal={formatOneTwentySignal} formatThirtyFiveSignal={formatThirtyFiveSignal} />
                </div>
                <div className="select-container">
                    <FiltroColor colorSignal = {colorSignal} />
                </div>
                <div className="select-container">
                    <FiltroName nameSignal = {nameSignal} />
                </div>
                <div className="select-container">
                    <a href="/projects">Ver proyectos</a>
                </div>
            </div>
            {filteredFilms.length === 0 && <h1 className="no-results">No hay resultados</h1>}
            <div className="films">
                {filteredFilms.map(film => (
                    <div className="film-card" key={film._id}>
                        <h1>{film.name}</h1>
                        <h2>{film.brand}</h2>
                        <p>{film.description}</p>
                        <img src={film.staticImageUrl} alt={film.name} />
                        <a href={`/getFilm/${film._id}`}>Ver más</a>
                        <button onClick={() => handleAddFilm(film)}>Añadir peli</button>
                    </div>
                ))}
            </div>
            {showModalMain && selectedFilm && (
                <div className="modal">
                    <div className="modal-content">
                        <h2>Añadir {selectedFilm.name} a un proyecto</h2>
                        <button onClick={handleAddFilmNewProject}>Añadir a nuevo proyecto</button>
                        <br/>
                        <button onClick={handleAddFilmExistingProject}>Añadir a proyecto existente</button>
                        <br/>
                        <button onClick={handleCloseModalMain}>Cerrar</button>
                    </div>
                </div>
            )}
            {showModalNewProject && (
                <div className="modal">
                    <div className="modal-content">
                        <div>
                            <h2>Añadir {selectedFilm?.name} a un nuevo proyecto</h2>
                            <form onSubmit={handleSubmitNewProject}>
                                <input type="text" placeholder="Nombre del proyecto" name = "name"/>
                                <br/>
                                <button type="submit">Añadir</button>
                            </form>
                            <button onClick={handleCloseModalNewProject}>Cerrar</button>
                        </div>
                    </div>
                </div>
            )}
            {showModalExistingProject && (
                <div className="modal">
                    <div className="modal-content">
                        <div>
                            <h2>Añadir {selectedFilm?.name} a un proyecto existente</h2>
                            <form onSubmit={handleSubmitExistingProject}>
                                <label>Proyectos:</label>
                                <br/>
                                <select name="project">
                                    {existingProjects.map(project => (
                                        <option value={project.name}>{project.name}</option>
                                    ))}
                                </select>
                                <br/>
                                <button type="submit">Añadir</button>
                            </form>
                            <button onClick={handleCloseModalExistingProject}>Cerrar</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Main;
