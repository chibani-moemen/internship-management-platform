package tn.iset.rades.internship_backend.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.http.HttpMethod;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private final JwtAuthFilter jwtAuthFilter;

    public SecurityConfig(JwtAuthFilter jwtAuthFilter) {
        this.jwtAuthFilter = jwtAuthFilter;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

        http
            .csrf(csrf -> csrf.disable())
            .cors(Customizer.withDefaults())
            .sessionManagement(sm -> sm.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth

                // 🔓 AUTH
                .requestMatchers("/api/auth/**").permitAll()

                // ✅ MATCHING (Student/Admin فقط)
                .requestMatchers(HttpMethod.GET, "/api/companies/match/*").hasAnyRole("STUDENT", "ADMIN")

                // 🔓 SKILLS (Student & Company)
                .requestMatchers(HttpMethod.PUT, "/api/students/*/skills").hasRole("STUDENT")
                .requestMatchers(HttpMethod.PUT, "/api/companies/*/skills").hasRole("COMPANY")

                // 🔓 REQUEST FLOW
                .requestMatchers(HttpMethod.POST, "/api/requests").hasRole("STUDENT")
                .requestMatchers(HttpMethod.PUT, "/api/requests/*/company-*").hasRole("COMPANY")
                .requestMatchers(HttpMethod.PUT, "/api/requests/*/iset-*").hasRole("ADMIN")

                // 🔐 ADMIN ONLY (Update/Delete)
                .requestMatchers(HttpMethod.PUT, "/api/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.DELETE, "/api/**").hasRole("ADMIN")

                // 🔓 READ ONLY باقي GET مسموحين
                .requestMatchers(HttpMethod.GET, "/api/**").permitAll()

                .anyRequest().authenticated()
            )
            .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}
