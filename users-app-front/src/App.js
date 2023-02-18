import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  Table,
  Modal,
} from "react-bootstrap";

const USER_API_BASE_URL = "http://localhost:8081/users";

const UserForm = ({
  onAddUser,
  onUpdateUser,
  selectedUser,
  setSelectedUser,
  show,
  handleClose,
}) => {
  const [user, setUser] = useState({
    id: "",
    nom: "",
    prenom: "",
    job: "",
  });

  useEffect(() => {
    if (selectedUser) {
      setUser(selectedUser);
    } else {
      setUser({
        id: "",
        nom: "",
        prenom: "",
        job: "",
      });
    }
  }, [selectedUser]);

  const handleChange = (e) => {
    setUser({
      ...user,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (selectedUser) {
      updateUser(user);
    } else {
      addUser(user);
    }
  };

  const addUser = async (user) => {
    try {
      const response = await axios.post(USER_API_BASE_URL, user);
      onAddUser(response.data);
      setUser({
        id: "",
        nom: "",
        prenom: "",
        job: "",
      });
      handleClose();
    } catch (error) {
      console.error(error);
    }
  };

  const updateUser = async (user) => {
    try {
      const response = await axios.put(USER_API_BASE_URL+'/'+selectedUser.id, user);
      onUpdateUser(response.data);
      setSelectedUser(null);
      handleClose();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>{selectedUser ? "Edit User" : "Add User"}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>

          <Form.Group controlId="formName">
            <Form.Label>Nom</Form.Label>
            <Form.Control
              type="text"
              name="nom"
              placeholder="Enter Nom"
              value={user.nom}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group controlId="formPrenom">
            <Form.Label>Prenom</Form.Label>
            <Form.Control
              type="text"
              name="prenom"
              placeholder="Enter Prenom"
              value={user.prenom}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group controlId="formJob">
            <Form.Label>Job</Form.Label>
            <Form.Control
              type="text"
              name="job"
              placeholder="Enter Job"
              value={user.job}
              onChange={handleChange}
            />
          </Form.Group>
          <Button variant="primary" type="submit">
            {selectedUser ? "Update" : "Add"}
          </Button>
          {selectedUser && (
            <Button
              variant="secondary"
              className="ml-2"
              onClick={() => setSelectedUser(null)}
            >
              Cancel
            </Button>
          )}
        </Form>
      </Modal.Body>
    </Modal>
  );
};

const UserList = ({ users, onEditUser, onDeleteUser }) => {
  return (
    <Table striped bordered hover>
      <thead>
        <tr>
          <th>Id</th>
          <th>Nom</th>
          <th>Prenom</th>
          <th>Job</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        {users.map((user) => (
          <tr key={user.id}>
            <td>{user.id}</td>
            <td>{user.nom}</td>
            <td>{user.prenom}</td>
            <td>{user.job}</td>

            <td>
              <Button variant="warning" onClick={() => onEditUser(user)}>
                Edit
              </Button>
              <Button
                variant="danger"
                className="ml-2"
                onClick={() => onDeleteUser(user.id)}
              >
                Delete
              </Button>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

const App = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showUserForm, setShowUserForm] = useState(false);

  useEffect(() => {
    getUsers();
  }, []);

  const getUsers = async () => {
    try {
      const response = await axios.get(USER_API_BASE_URL);
      setUsers(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const addUser = (user) => {
    setUsers([...users, user]);
  };

  const updateUser = (updatedUser) => {
    setUsers(
      users.map((user) => (user.id === updatedUser.id ? updatedUser : user))
    );
  };

  const deleteUser = async (id) => {
    try {
      await axios.delete(USER_API_BASE_URL + "/" + id);
      setUsers(users.filter((user) => user.id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setShowUserForm(true);
  };

  const handleDeleteUser = (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      deleteUser(id);
    }
  };

  const handleCloseUserForm = () => {
    setShowUserForm(false);
    setSelectedUser(null);
  };

  return (
    <Container>
      <Row className="mt-3">
        <Col>
          <h1>Users</h1>
        </Col>
        <Col className="text-right">
          <Button variant="success" onClick={() => setShowUserForm(true)}>
            Add User
          </Button>
        </Col>
      </Row>
      <Row className="mt-3">
        <Col>
          <UserList
            users={users}
            onEditUser={handleEditUser}
            onDeleteUser={handleDeleteUser}
          />
        </Col>
      </Row>
      <UserForm
        onAddUser={addUser}
        onUpdateUser={updateUser}
        selectedUser={selectedUser}
        setSelectedUser={setSelectedUser}
        show={showUserForm}
        handleClose={handleCloseUserForm}
      />
    </Container>
  );
};

export default App;
