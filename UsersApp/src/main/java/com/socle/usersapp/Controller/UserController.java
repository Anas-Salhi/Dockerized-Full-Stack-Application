package com.socle.usersapp.Controller;

import com.socle.usersapp.DAO.UserRepository;
import com.socle.usersapp.Model.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping(value = "/users")
@CrossOrigin
public class UserController {
    @Autowired
    UserRepository userRepository;
    @GetMapping
    public ResponseEntity <List<User>> getStudents(){
        List<User> users =userRepository.findAll();
        return ResponseEntity.ok().body(users);

    }
    @GetMapping("/{id}")
    public ResponseEntity < User > getUserById(@PathVariable(value = "id") Integer id)
    {
    User user = userRepository.findById(id).orElse(null);
        if (user != null) {
        return new ResponseEntity<>(user, HttpStatus.OK);
    } else {
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }
    }

    @PostMapping
    public ResponseEntity<User> createUser(@RequestBody User user) {
        User newUser = userRepository.save(user);
        return new ResponseEntity<>(newUser, HttpStatus.CREATED);
    }


    @PutMapping("/{id}")
    public ResponseEntity<User> updateClient(@PathVariable Integer id, @RequestBody User user) {
        User existingUser = userRepository.findById(id).orElse(null);
        if (existingUser != null) {
            existingUser.setId(user.getId());
            existingUser.setNom(user.getNom());
            existingUser.setPrenom(user.getPrenom());
            existingUser.setJob(user.getJob());
            userRepository.save(existingUser);
            return new ResponseEntity<>(user, HttpStatus.OK);
        }else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteUser(@PathVariable("id") int id){
        try{
            userRepository.deleteById(id);
        } catch (Exception e) {
            return new ResponseEntity<>("User not Found!", HttpStatus.INTERNAL_SERVER_ERROR);
        }
        return null;
    }
}

