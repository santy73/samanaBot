

# **PROYECTO DE INTEGRACIÓN CHAT INTELIGENCIA ARTIFICIAL WEB RESERVAS**

## **SITUACIÓN INICIAL**

La web [https://samanainn.com](https://samanainn.com), es una web de reservas especializadas en la provincia de Samana en República Dominicana.   
Esta web, el objetivo principal es el de reservas de alojamiento.  
Tiene un blog con contenido hablando de Samana, tanto en español como en ingles.  
También se pueden hacer reservas de Restaurantes, Vehiculos, Experiencias y excursiones, Eventos, y servicios tipo lavandería, doméstico, etc..

## **TECNOLOGÍA ACTUAL**

La página está realizada en Laravel dispone de un frontend y backoffice  
La base de datos es MySql

## **FUNCIONALIDADES A INTEGRAR**

# **Realizar una landingpage independiente, que disponga de lo siguiente:**

* Una parte central con una casilla de entrada para chat. Este chat, estará potenciado con inteligencia artificial, para buscar en la página según las preguntas que haga el cliente.  
* Un banner superior que se modifique según las búsquedas y resultados. Mostrando ofertas o contenido relevante.  
* En la parte inferior, se mostrarán los resultados y respuestas del agente chat.   
* Chat multiagente con las siguientes características.

1. ## **Agente Experto en SamanaInn**

	    **Comportamiento**:  
Obtener la pregunta inicial y detectar que necesita el usuario para redirigir a los agentes necesarios, así como llamar a los controladores para modificar banners y navegación. Gestiona toda la conversación del usuario, saltando entre agentes. 

2. ## **AGENTE CONSULTA POR TIPO DE BUSQUEDAS**

	    **Comportamiento**:  
FILTRA lo que quiere buscar el usuario y gestiona las conexiones diferentes para dar los resultados necesarios

3. ## **AGENTE BOOKING**

	    **Comportamiento**:  
En la pagina de resultados y detalle puede obtener la información de la página y los indices necesarios para ofrecer otros servicios asociados

4. ## **AGENTES ESPECIFICOS**

	    **Comportamiento**:  
Agentes que sean especificos para las diferentes consultas, como Gastronomia, que hacer, que visitar, etc..

5. ## **AGENTE VALIDACIÓN**

	    **Comportamiento**:  
Este agente regula las respuestas generadas para evitar que se filtre y acceda a información que no es específica de nuestra plataforma

## **CASOS DE USO**

* **Entrada:** Un usuario entra en la web y pregunta que hacer en samana, al chat

	**Comportamiento :** El chat usa los agentes adecuados para dar una respuesta sobre la información de samana que disponemos, puede ofrecerle una pregunta para saber si quiere realizar una excursión, visitar algún sitio en concreto, comer, o alquilar un establecimiento. Cuando se disponga de la información adecuada mediante conversación unica o con intercambio, persistir la conversación y ofrecer el contenido más adecuado de todo lo que tenemos en la web. Los resultados si son para alquilar o reservar algo, se mostrará la pagina de filtro que tiene ya el script laravel, generando la respuesta mediante una url que redirija a la página en concreto

* **Entrada:** En caso que el usuario quiera alquilar una vivienda

	**Comportamiento :** En caso de no proporcionar información de lo que está buscando, se le puede proponer preguntas tipo, si viaja con familia, si le gusta estar en sitio centrico, naturaleza, casa o apartamento. Cuantas personas viajan, si viajan con familiares, niños o ancianos.  Cuando se disponga de la información adecuada mediante conversación unica o con intercambio, persistir la conversación y ofrecer el contenido más adecuado de todo lo que tenemos en la web. Los resultados si son para alquilar o reservar algo, se mostrará la pagina de filtro que tiene ya el script laravel, generando la respuesta mediante una url que redirija a la página en concreto

* **Proponer más casos de uso.**

## **ESTRUCTURA SQL CON DATOS EJEMPLO**

fichero smv2\_36.sql  
las tablas de los diferentes servicios, como healthcare, wellness, sports, financial, shopping, professional, replican las tablas de business, ej. bravo\_wellness, bravo\_wellness\_category, etc..

## **TECNOLOGÍAS PROPUESTAS**

Realizar landing con código independiente que esté en el mismo dominio, el chatbot se incrustará en la landing, mediante un script, que estará generado por una api, preferentemente en nodejs, que se conecte a las fuentes de datos necesarias, y a los sistemas de inteligencia artificial comerciales que sean más capaces, podemos integrar también un sistema MCP. El código si se usa un framework javascript, preferentemente será nuxt3 o vue3  
