import { handlePermission } from "./users/pages/login/login.js"
import { IndexService } from "./restaurants/services/index.service.js"

const indexService = new IndexService;

document.addEventListener("DOMContentLoaded", () => {
    indexService.mapCreate()
    handlePermission()
})