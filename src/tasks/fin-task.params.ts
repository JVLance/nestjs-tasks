import { IsEnum, IsIn, IsOptional, IsString, MinLength } from "class-validator";
import { TaskStatus } from "./task.model";
import { Transform } from "class-transformer";

export class FindTaskParams {
    @IsOptional()
    @IsEnum(TaskStatus)
    status?: TaskStatus;

    @IsOptional()
    @MinLength(3)
    @IsString()
    search?: string;

    @IsOptional()
 //   @IsString()
    @Transform(({ value }: { value?: string }) => {
        if (!value) return undefined;

        return value
            .split(',')
            .map((label:string) => label.trim())
            .filter((label:string) => label.length);
    })
    labels?: string[];

    @IsOptional()
    @IsIn(['createdAt', 'title', 'status'])
    sortBy?: string = 'createdAt';

    @IsOptional()
    @IsEnum(['ASC', 'DESC'])
    sortOrder?: 'ASC' | 'DESC' = 'DESC'
}