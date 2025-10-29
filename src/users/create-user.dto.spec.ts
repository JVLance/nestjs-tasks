import { validate } from "class-validator";
import { CreateUserDto } from "./create-user.dto";

describe('CreateUserDto', () => {

    let dto = new CreateUserDto();

    beforeEach(() => {
        dto = new CreateUserDto();
        dto.email = 'test@test.com';
        dto.name = 'Jorge';
        dto.password = '123456A#';
    });

    it('should validate complete valid data', async () => {

        // Arrange
        // Act
        const errors = await validate(dto);

        // Assert
        expect(errors.length).toBe(0);

    });

    it('should fail on invalid email', async () => {

         // Arrange      
        dto.email = 'test';
       
        // Act
        const errors = await validate(dto);

        // Assert
    //    console.log(errors);
        expect(errors.length).toBeGreaterThan(0);
        expect(errors[0].property).toBe('email');
        expect(errors[0].constraints).toHaveProperty('isEmail');
    });

    // 1) At least 1 uppercase letter
    // 2) At least 1 number
    // 3) At least 1 special character

    const testPassword = async (password: string, message: string) => {
         // Arrange
        dto.password = password;

        // Act
        const errors = await validate(dto);

        // Assert
        const passwordError = errors.find(error => error.property === 'password');

        expect(passwordError).not.toBeUndefined();

        const messages = Object.values(passwordError?.constraints ?? {});

        expect(messages).toContain(message)
    }

    it('should fail without at least 1 uppercase letter', async () => {

        await testPassword('abcdfa', 'Password must contain at least 1 uppercase letter');

    });

    it('should fail without at least 1 number', async () => {

        await testPassword('abcdfaA', 'Password must contain at least 1 number');
    });

    it('should fail without at least 1 special character', async () => {

        await testPassword('abcdfaA1', 'Password must contain at least 1 special character');
    });
});