const RB=ReactBootstrap;
const {Alert, Card, Button, Table} = ReactBootstrap;


class App extends React.Component {

    auth = firebase.auth(); // เพิ่มนิยาม auth ที่นี้

    title = (
      <Alert variant="info">
        <b>Work6 :</b> Firebase
      </Alert>
    );
    footer = (
      <div>
        By 643021336-0 รัฐมนตรี วสันต์ CS-VIP <br />
        College of Computing, Khon Kaen University
      </div>
    );
    state = {
        scene: 0,
        students:[],
        stdid:"",
        stdtitle:"",
        stdfname:"",
        stdlname:"",
        stdemail:"",
        stdphone:"",
    }

    edit(std){      
        this.setState({
         stdid    : std.id,
         stdtitle : std.title,
         stdfname : std.fname,
         stdlname : std.lname,
         stdemail : std.email,
         stdphone : std.phone,
        })
     }
 
      
     render() {
      const { user } = this.state;
  
      return (
        <Card>
          <Card.Header>{this.title}</Card.Header>
          <Card.Body>
  {user ? (
    <div>
      <p>Hello, {user.displayName || user.email}!</p>
      <img
        src={user.photoURL}
        alt="Profile"
        style={{ maxWidth: '100px', maxHeight: '100px' }}
      />
      {this.state.ustudent && (
        <div>
          <p>รหัส: {this.state.ustudent.id}</p>
          <p>คำนำหน้า: {this.state.ustudent.title}</p>
          <p>ชื่อ: {this.state.ustudent.fname}</p>
          <p>นามสกุล: {this.state.ustudent.lname}</p>
          <p>Email: {this.state.ustudent.email}</p>
          <p>โทรศัพท์: {this.state.ustudent.phone}</p>
        </div>
      )}

      <Button onClick={() => this.logout()}>Logout</Button>
    </div>
  ) : (
    <Button onClick={() => this.loginWithGoogle()}>Login with Google</Button>
  )}
  <Button onClick={() => this.readData()}>Read Data</Button>
  <Button onClick={() => this.autoRead()}>Auto Read</Button>
  <div>
    <StudentTable data={this.state.students} app={this} />
  </div>
</Card.Body>

          <Card.Footer>
            <b>Add/Edit Student Information:</b>
            <br />
            <TextInput label="ID" app={this} value="stdid" style={{ width: 120 }} />
            <TextInput label="Title" app={this} value="stdtitle" style={{ width: 100 }} />
            <TextInput label="First Name" app={this} value="stdfname" style={{ width: 120 }} />
            <TextInput label="Last Name" app={this} value="stdlname" style={{ width: 120 }} />
            <TextInput label="Email" app={this} value="stdemail" style={{ width: 150 }} />
            <TextInput label="Phone" app={this} value="stdphone" style={{ width: 120 }} />
            <Button onClick={() => this.insertData()}>Save</Button>
          </Card.Footer>
          <Card.Footer>{this.footer}</Card.Footer>
        </Card>
      );
  }
  
    
  
    insertData(){
        db.collection("students").doc(this.state.stdid).set({
           title : this.state.stdtitle,
           fname : this.state.stdfname,
           lname : this.state.stdlname,
           phone : this.state.stdphone,
           email : this.state.stdemail,
        });
    }

  
    autoRead(){
        db.collection("students").onSnapshot((querySnapshot) => {
            var stdlist=[];
            querySnapshot.forEach((doc) => {
                stdlist.push({id:doc.id,... doc.data()});                
            });          
            this.setState({students: stdlist});
        });
    }

    
    readData(){
        db.collection("students").get().then((querySnapshot) => {
            var stdlist=[];
            querySnapshot.forEach((doc) => {
                stdlist.push({id:doc.id,... doc.data()});                
            });
            console.log(stdlist);
            this.setState({students: stdlist});
        });
    }

    // delete button
    delete(std){
        if(confirm("ต้องการลบข้อมูล")){
           db.collection("students").doc(std.id).delete();
        }
    }
    
    data() {
        return {
            title: "Work 6:  เรียกใช้ฐานข้อมูล Firebase ด้วย VueJS",
            footer: "643021336-0 รัฐมนตรี วสันต์ CS-VIP",
            students: [],
            editstd: {},
            editmode: 0,
            user: null,  // เพิ่มตัวแปร user=null คือยังไม่ login
            ustudent: null,
        };
    }
    mounted() {
      firebase.auth().onAuthStateChanged((user) => {
        if (user) {
            this.user = user.toJSON();
            this.getstudent(user.email);  
        } else {
            this.user = null;
        }
    });
  }
    
    methods() {

      }

      loginWithGoogle() {
        const provider = new firebase.auth.GoogleAuthProvider();
        this.auth.signInWithPopup(provider)
            .then((result) => {
                const user = result.user;
                this.setState({ user });
                this.getstudent(user.email);  
            })
            .catch((error) => {
                console.error(error.message);
            });
    }
    
    logout() {
      if (window.confirm("แน่ใจใช่ไหมว่าจะออกจากระบบ?")) {
          this.auth.signOut().then(() => {
              this.setState({ user: null });
          });
      }
  }

  getstudent(email) {
    db.collection("students")
        .where("email", "==", email)
        .limit(1)
        .get()
        .then((querySnapshot) => {
            if (!querySnapshot.empty) {  // เพิ่มการตรวจสอบว่ามีข้อมูลหรือไม่
                const doc = querySnapshot.docs[0];
                this.setState({ ustudent: {id: doc.id, ...doc.data()} });
            } else {
                this.setState({ ustudent: null });
            }
        });
}
      

  }



  const container = document.getElementById("myapp");
  const root = ReactDOM.createRoot(container);
  root.render(<App />);
  // ใช้ config จาก เว็บ Firebase: Project Setting 
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyCGjL1V3c5Ko_Lxbe7yDZdbQMqT8ZdbMQ4",
    authDomain: "web2566-26bf7.firebaseapp.com",
    projectId: "web2566-26bf7",
    storageBucket: "web2566-26bf7.appspot.com",
    messagingSenderId: "167834565682",
    appId: "1:167834565682:web:d8a939acb04b0ecfce502b",
    measurementId: "G-E4QQDKX4E8"
  };
  firebase.initializeApp(firebaseConfig);      
  const db = firebase.firestore();

  db.collection("students").get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
        console.log(`${doc.id} =>`,doc.data());
    });
  });

  function StudentTable({data, app}){
    return <table className='table'>
    <tr>
        <td>รหัส</td>
        <td>คำนำหน้า</td>
        <td>ชื่อ</td>
        <td>สกุล</td>
        <td>email</td>
        </tr>
        {
          data.map((s)=><tr>
          <td>{s.id}</td>
          <td>{s.title}</td>
          <td>{s.fname}</td>
          <td>{s.lname}</td>
          <td>{s.email}</td>
          <td><EditButton std={s} app={app}/></td>
          <td><DeleteButton std={s} app={app}/></td>        
          </tr> )
        }
    </table>
  }



  function TextInput({label,app,value,style}){
    return <label className="form-label">
    {label}:    
     <input className="form-control" style={style}
     value={app.state[value]} onChange={(ev)=>{
         var s={};
         s[value]=ev.target.value;
         app.setState(s)}
     }></input>
   </label>;  
  }

  // add or edit information
  function EditButton({std,app}){
    return <button onClick={()=>app.edit(std)}>แก้ไข</button>
   }

  // component delete button
  function DeleteButton({std,app}){    
    return <button onClick={()=>app.delete(std)}>ลบ</button>
  }