document.addEventListener("DOMContentLoaded", () => {
    const adofaiInput = document.getElementById("adofaiFile")
    const downloadList = document.getElementById("downloadList")
    let uploadIndex = 0

    function readFile(input, reader, index) {
        uploadIndex = index
        if (index >= input.files.length) {
            input.value = ""
            return
        }

        reader.readAsArrayBuffer(input.files[index])
    }

    adofaiInput.addEventListener("change", (event) => {
        const input = event.target
        const reader = new FileReader()

        reader.onload = () => {
            fetch("https://beta-storage.aef.kr/session", {
                method: "POST",
                body: reader.result
            })
                .then((response) => response.json())
                .then((result) => {
                    let sessionID = result["sessionID"]
                    fetch(`https://beta-storage.aef.kr/session/${sessionID}`, {
                        method: "DELETE"
                    })
                        .then((response) => response.json())
                        .then((result) => {
                            let levelID = result["levelID"]
                            let newElement = document.createElement("p")
                            let newLink = document.createElement("a")
                            newLink.href = `https://beta-storage.aef.kr/level_file/${levelID}`

                            newElement.appendChild(newLink)
                            downloadList.appendChild(newElement)

                            readFile(input, reader, uploadIndex + 1)
                        })
                })
        }

        readFile(input, reader, 0)
    })
})