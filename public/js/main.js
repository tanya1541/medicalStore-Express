document.getElementById("delete-medicine").addEventListener("click", function(event) {
    axios.delete("http://localhost:3000/medicines/delete/" + event.target.getAttribute('dataid'))
        .then(response => {
            console.log(response);
            alert("deleting medicine");
            window.location = '/medicines';
        })
        .catch(error => console.log(error))
});