package com.example.projectfinal.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.transaction.annotation.EnableTransactionManagement;
import org.springframework.web.servlet.config.annotation.EnableWebMvc;
import org.springframework.web.servlet.view.InternalResourceViewResolver;
import springfox.documentation.builders.ApiInfoBuilder;
import springfox.documentation.builders.PathSelectors;
import springfox.documentation.builders.RequestHandlerSelectors;
import springfox.documentation.service.ApiInfo;
import springfox.documentation.service.Contact;
import springfox.documentation.spi.DocumentationType;
import springfox.documentation.spring.web.plugins.Docket;
import springfox.documentation.swagger2.annotations.EnableSwagger2;


@EnableSwagger2
@EnableWebMvc
@Configuration
@EnableTransactionManagement
public class SwaggerConfig {
    @Bean
    public Docket api() {
        return new Docket(DocumentationType.SWAGGER_2)
                .apiInfo(apiInfo())
                .select()
                .paths(PathSelectors.any())
                .apis(RequestHandlerSelectors.any())
                .build();
    }

    private ApiInfo apiInfo() {
        return new ApiInfoBuilder()
                .title("HuyShtorm")
                .description("Project Final")
                .contact(new Contact("Nguyễn Quốc Huy", "https://github.com/HuyShtorm", "heilmehuy34@gmail.com"))
                .license("Apache 2.0")
                .licenseUrl("https://apache.org/licenses/LICENSE-2.0")
                .version("1.0.0")
                .build();

    }

    @Bean
    public InternalResourceViewResolver resourceViewResolver() {
        return new InternalResourceViewResolver();
    }

}