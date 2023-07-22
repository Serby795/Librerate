import React from "react";
import { useForm } from "react-hook-form";


const AdvancedSearch = () => {

    const { register, handleSubmit } = useForm();
    const onSubmit = async (data) => {
       const title = data.title;
       const isbn = data.isbn;
       const subject = data.subject;
       const course = data.course;
        try {
            const response = await fetch('http://localhost/VSCODE/RegistroJS/index.php', {
                method: 'GET',
                redirect: '/resultadoBusqueda',
                header: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    title: title,
                    isbn: isbn,
                    subject: subject,
                    course: course
                })
            })
            console.log(response);
        } catch (error) {
            console.log(error);
        }

    }

    return (
        <>
            <div className="advancedSearchContainer">
                <div className="advancedSearch">
                    <h2 className="searchTitle">Búsqueda detallada</h2>
                    <hr className="hr" />
                    <form className="advancedSearchForm" onSubmit={handleSubmit(onSubmit)}>
                        <div className="inputDataContainer">
                            <label for="title">Título:</label>
                                <input type="text" id="title" className="inputData" {...register('title')} />
                        </div>
                        <div className="inputDataContainer">
                            <label for="isbn">ISBN:</label>
                                <input type="text" id="isbn" className="inputData" {...register('isbn')}/>
                        </div>
                        <div className="inputDataContainer">
                            <label for="subject">Asignatura: </label>                           
                                <input type="text" id="subject" className="inputData" {...register('subject')}/>
                        </div>
                        <div className="inputDataContainer">
                            <label for="selectCourse">Curso:</label>
                                <select id="selectCourse"  className="inputDataSelect" {...register('course')}>
                                    <option value="">Seleccione curso</option>
                                    <option value="1">1º Primaria</option>
                                    <option value="2">2º Primaria</option>
                                    <option value="3">3º Primaria</option>
                                    <option value="4">4º Primaria</option>
                                    <option value="5">5º Primaria</option>
                                    <option value="6">6º Primaria</option>
                                    <option value="7">1º ESO</option>
                                    <option value="8">2º ESO</option>
                                    <option value="9">3º ESO</option>
                                    <option value="10">4º ESO</option>
                                </select>
                        </div>
                        <input type="submit" value="Buscar" className="btn btn-customRed searchButton" />
                    </form>
                </div>
            </div>
        </>
    );
}


export default AdvancedSearch