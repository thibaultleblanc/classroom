import { library } from '@fortawesome/fontawesome-svg-core'
import { faSchool, faSquare } from '@fortawesome/free-solid-svg-icons'
import { faGithub, faLinkedin } from '@fortawesome/free-brands-svg-icons' // Import des icônes de marques
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

// Ajoutez les icônes nécessaires à la bibliothèque
library.add(faSchool, faSquare, faGithub, faLinkedin)

export default FontAwesomeIcon