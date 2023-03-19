function instanceLoader (instance, setInstance, id) {
    let url = `http://127.0.0.1:8000/api/v1/${instance}/${id}`;
    fetch(url).then(res => {
        if (res.status === 200) {
          return res.json();
        } else if (res.status === 404) {
          setInstance(404);
        } else {
          console.log('error');
        };
      }).then(result => setInstance(result))
      .catch(error => console.log(error.message));
    };
