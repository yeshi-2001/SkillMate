package com.skillmate.controller;

import com.skillmate.entity.User;
import com.skillmate.service.MatchService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/matches")
@RequiredArgsConstructor
public class MatchController {

    private final MatchService matchService;

    @GetMapping
    public ResponseEntity<?> getMatches(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(matchService.getMyMatches(user.getId()));
    }
}
