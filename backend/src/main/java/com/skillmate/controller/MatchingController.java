package com.skillmate.controller;

import com.skillmate.service.MatchingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/matches")
public class MatchingController {
    @Autowired
    private MatchingService matchingService;

    @GetMapping("/{userId}")
    public ResponseEntity<List<Map<String, Object>>> findMatches(@PathVariable Long userId) {
        return ResponseEntity.ok(matchingService.findMatches(userId));
    }
}
