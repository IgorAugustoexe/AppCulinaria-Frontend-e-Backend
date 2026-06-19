import React, { Fragment, useRef, useState } from "react";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { Alert, FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { globalStyles } from "../../styles/globalStyles";
import { KeyboardAwareScreen } from "../../components/KeyboardAwareScreen";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { InputData } from "../../components/InputData";
import { AppButton } from "../../components/AppButton";
import { colors } from "../../themes/colors";
import { recipeCategories } from "../../mocks/categories";
import { AppIcon } from "../../components/AppIcon";
import { layout } from "../../themes/dimensions";
import { getApiErrorMessage } from "../../config/axios";
import { recipeApi } from "../../api/recipeApi";
import { Recipe, RecipeInput } from "../../types/api";

type RecipeRouteItem = Recipe & {
  categoria?: string;
};

type RecipeFormRouteParams = {
  RecipeForm: {
    recipe?: RecipeRouteItem;
  };
};

type RecipeFormInput = {
  nome: string;
  id_categoria: string;
  categoria: string;
  tempo_preparo_minutos: string;
  porcoes: string;
  ingredientes: {
    value: string;
  }[];
  modo_preparo: string;
};

export default function RecipeFormScreen() {
  const route = useRoute<RouteProp<RecipeFormRouteParams, "RecipeForm">>();
  const navigation = useNavigation<any>();

  const recipe = useRef<RecipeRouteItem | undefined>(route.params?.recipe).current;
  const ingredientInputRefs = useRef<any[]>([]);
  const [showCategories, setShowCategories] = useState<boolean>(false);
  const [savingRecipe, setSavingRecipe] = useState<boolean>(false);

  const { control, clearErrors, handleSubmit, setValue, watch } = useForm<RecipeFormInput>({
    defaultValues: {
      nome: recipe?.nome ?? "",
      id_categoria: recipe?.id_categoria ? String(recipe.id_categoria) : "",
      categoria: recipe?.categoria ?? "",
      tempo_preparo_minutos: recipe?.tempo_preparo_minutos ? String(recipe.tempo_preparo_minutos) : "",
      porcoes: recipe?.porcoes ? String(recipe.porcoes) : "",
      ingredientes: recipe?.ingredientes?.length
        ? recipe.ingredientes.map((ingredient: string) => ({ value: ingredient }))
        : [{ value: "" }],
      modo_preparo: recipe?.modo_preparo ?? "",
    },
  });

  const {
    fields: ingredientFields,
    append: appendIngredient,
    remove: removeIngredient,
  } = useFieldArray({
    control,
    name: "ingredientes",
  });

  const selectedCategory = watch("categoria");
  const selectedCategoryId = watch("id_categoria");
  const selectedCategoryItem = recipeCategories.find((category) => String(category.id) === selectedCategoryId);

  const handleSelectCategory = (category: (typeof recipeCategories)[number]) => {
    setValue("id_categoria", String(category.id), { shouldValidate: true });
    setValue("categoria", category.name, { shouldValidate: true });
    clearErrors(["id_categoria", "categoria"]);
    setShowCategories(false);
  };

  const handleAddIngredient = () => {
    const newIngredientIndex = ingredientFields.length;

    appendIngredient({ value: "" }, { shouldFocus: false });

    setTimeout(() => {
      ingredientInputRefs.current[newIngredientIndex]?.focus();
    }, 300);
  };

  const handleSaveRecipe = async (data: RecipeFormInput) => {
    const recipeData: RecipeInput = {
      nome: data.nome,
      id_categoria: Number(data.id_categoria),
      tempo_preparo_minutos: Number(data.tempo_preparo_minutos),
      porcoes: Number(data.porcoes),
      ingredientes: data.ingredientes.map((ingredient) => ingredient.value.trim()).filter(Boolean),
      modo_preparo: data.modo_preparo,
    };

    try {
      setSavingRecipe(true);
      if (recipe?.id) {
        await recipeApi.update(recipe.id, recipeData);
      } else {
        await recipeApi.create(recipeData);
      }
      navigation.goBack();
    } catch (error) {
      navigation.navigate("ModalInfo", {
        title: `Não foi possível ${recipe?.id ? "Editar" : "Cadastrar"} a receita`,
        message: getApiErrorMessage(error),
      });
    } finally {
      setSavingRecipe(false);
    }
  };

  // componentes

  const RecipeNameField = () => (
    <InputData
      control={control}
      clearErrors={clearErrors}
      name="nome"
      inputTitle="Nome da receita"
      placeholder="Ex: Bolo de cenoura"
      maxLength={100}
      rules={{ required: "Informe o nome da receita" }}
    />
  );

  const CategoriesList = () => (
    <View style={styles.categorySelectorContainer}>
      <Controller
        control={control}
        name="id_categoria"
        rules={{ required: "Escolha uma Cateogria" }}
        render={({ fieldState: { error } }) => (
          <Fragment>
            <Text style={styles.inputTitle}>Categoria</Text>
            <TouchableOpacity
              style={[
                styles.categorySelectorButton,
                error && { borderColor: colors.danger },
                showCategories ? styles.categorySelectorButtonShow : { borderRadius: 8 },
              ]}
              activeOpacity={0.8}
              onPress={() => setShowCategories((currentValue) => !currentValue)}
            >
              {selectedCategoryItem && (
                <View style={[styles.categoryColor, { backgroundColor: selectedCategoryItem.color }]} />
              )}
              <Text style={[styles.categorySelectorText, !selectedCategory && styles.categorySelectorPlaceholder]}>
                {selectedCategoryItem?.name ||
                  selectedCategory ||
                  `Selecione uma das ${recipeCategories.length} categorias`}
              </Text>
              <AppIcon name={showCategories ? "angleUp" : "angleRight"} color={colors.textSecondary} />
            </TouchableOpacity>
            {showCategories && (
              <FlatList
                data={recipeCategories}
                keyExtractor={(item) => String(item.id)}
                scrollEnabled={false}
                style={[styles.categoryList, error && { borderColor: colors.danger }]}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={[
                      selectedCategory === item.name && {
                        backgroundColor: item.lightColor,
                      },
                    ]}
                    activeOpacity={0.8}
                    onPress={() => handleSelectCategory(item)}
                    disabled={selectedCategory == item.name}
                  >
                    <View
                      style={[
                        styles.categoryOptionField,
                        selectedCategory === item.name && {
                          marginHorizontal: 0,
                          paddingHorizontal: 15,
                        },
                      ]}
                    >
                      <View style={[styles.categoryColor, { backgroundColor: item.color }]} />
                      <Text style={styles.categoryOptionText}>{item.name}</Text>
                    </View>
                  </TouchableOpacity>
                )}
              />
            )}
            {error && <Text style={globalStyles.errorText}>{error.message}</Text>}
          </Fragment>
        )}
      />
    </View>
  );

  const RecipeInfo = () => (
    <View style={styles.recipeInfoRow}>
      <View style={{ width: "45%" }}>
        <InputData
          control={control}
          clearErrors={clearErrors}
          name="tempo_preparo_minutos"
          inputTitle="Tempo de preparo (min)"
          placeholder="Ex: 45"
          keyboardType="numeric"
          maxLength={3}
          rules={{ required: "Informe o tempo de preparo" }}
          iconName="clock"
        />
      </View>
      <View style={{ width: "45%" }}>
        <InputData
          control={control}
          clearErrors={clearErrors}
          name="porcoes"
          inputTitle="Porções"
          placeholder="Ex: 4"
          keyboardType="numeric"
          maxLength={2}
          rules={{ required: "Informe a quantidade de porções" }}
          iconName="userGroup"
        />
      </View>
    </View>
  );

  const IngredientsList = () => (
    <View style={styles.ingredientsContainer}>
      <View style={{ marginBottom: 10 }}>
        <Text style={styles.inputTitle}>Ingredientes</Text>
      </View>
      {ingredientFields.map((field, index) => (
        <View key={field.id} style={styles.ingredientField}>
          <View style={{ flex: 1 }}>
            <InputData
              control={control}
              clearErrors={clearErrors}
              name={`ingredientes.${index}.value`}
              placeholder={`Ingrediente ${index + 1}`}
              maxLength={50}
              inputRef={(input: any) => {
                ingredientInputRefs.current[index] = input;
              }}
              rules={{ required: "Informe o ingrediente" }}
            />
          </View>
          <TouchableOpacity
            style={[styles.ingredientButton, ingredientFields.length === 1 && { opacity: 0.3 }]}
            activeOpacity={0.8}
            disabled={ingredientFields.length === 1}
            onPress={() => removeIngredient(index)}
            hitSlop={10}
          >
            <AppIcon name="delete" color={colors.icon} />
          </TouchableOpacity>
        </View>
      ))}
      <TouchableOpacity
        style={styles.addIngredientButton}
        activeOpacity={0.8}
        onPress={handleAddIngredient}
        hitSlop={15}
      >
        <AppIcon name="add" color={colors.primary} />
        <Text style={styles.addIngredientText}>Adicionar ingrediente</Text>
      </TouchableOpacity>
    </View>
  );

  const RecipeInstructionsField = () => (
    <View style={styles.recipeInstructionsContainer}>
      <InputData
        control={control}
        clearErrors={clearErrors}
        name="modo_preparo"
        inputTitle="Modo de preparo"
        placeholder="Descreva o passo a passo da receita"
        multiline
        maxLength={1000}
        showMaxLength
        inputStyle={styles.multilineInput}
        rules={{ required: "Informe o modo de preparo" }}
      />
    </View>
  );

  const FooterButtons = () => (
    <View style={styles.footerButtons}>
      <AppButton
        title="Cancelar"
        onPress={() => navigation.goBack()}
        containerStyle={[styles.cancelButton]}
        textStyle={{ color: colors.primary }}
        icon={{ name: "cancel", color: colors.primary }}
        disabled={savingRecipe}
      />
      <AppButton
        title={recipe ? "Salvar Alterações" : "Cadastrar Receita"}
        onPress={handleSubmit(handleSaveRecipe)}
        containerStyle={[styles.submitButton]}
        icon={{ name: "check", color: colors.textButton }}
        loading={savingRecipe}
      />
    </View>
  );

  return (
    <Fragment>
      <KeyboardAwareScreen contentContainerStyle={styles.screenContainer}>
        <RecipeNameField />
        <CategoriesList />
        <RecipeInfo />
        <IngredientsList />
        <RecipeInstructionsField />
      </KeyboardAwareScreen>
      <FooterButtons />
    </Fragment>
  );
}

const styles = StyleSheet.create({
  screenContainer: {
    flexGrow: 1,
    padding: layout.windowWidth / 16,
    backgroundColor: colors.background,
  },
  multilineInput: {
    minHeight: layout.windowWidth / 3,
    maxHeight: layout.windowWidth / 2,
    paddingVertical: 12,
    textAlignVertical: "top",
  },
  inputTitle: {
    fontSize: 12,
    fontWeight: "bold",
    color: colors.textSecondary,
    marginBottom: 5,
  },
  categorySelectorContainer: {
    marginBottom: 15,
  },
  categorySelectorButton: {
    borderTopWidth: 1,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 12,
    paddingVertical: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  categorySelectorButtonShow: {
    borderBottomWidth: 0,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  categorySelectorText: {
    color: colors.textPrimary,
    flex: 1,
    marginRight: 8,
  },
  categorySelectorPlaceholder: {
    color: colors.placeHolderTextColor,
  },
  categoryList: {
    borderBottomWidth: 1,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    borderColor: colors.border,
  },
  categoryOptionField: {
    borderTopWidth: 1,
    borderColor: colors.border,
    paddingVertical: 10,
    marginHorizontal: 15,
    flexDirection: "row",
    alignItems: "center",
  },
  categoryColor: {
    width: 14,
    height: 14,
    borderRadius: 7,
    marginRight: 10,
  },
  categoryOptionText: {
    color: colors.textPrimary,
    fontWeight: "bold",
  },
  recipeInfoRow: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
  },
  ingredientsContainer: {
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: colors.border,
    paddingTop: 10,
  },
  ingredientField: {
    flexDirection: "row",
    alignItems: "flex-start",
  },

  ingredientButton: {
    padding: 10,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 8,
  },
  addIngredientButton: {
    marginBottom: 10,
    borderRadius: 8,
    flexDirection: "row",
    justifyContent: "flex-start",
    alignSelf: "flex-start",
  },
  addIngredientText: {
    color: colors.primary,
    fontWeight: "bold",
    marginLeft: 8,
  },
  recipeInstructionsContainer: {
    marginTop: 10,
  },
  footerButtons: {
    flexDirection: "row",
    width: "100%",
    gap: 12,
    padding: 25,
    borderTopWidth: 0.5,
    borderColor: colors.border,
    backgroundColor: colors.background,
  },
  submitButton: {
    backgroundColor: colors.primary,
    borderWidth: 1,
    borderColor: colors.primary,
    width: "60%",
  },
  cancelButton: {
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.primary,
    width: "40%",
  },
});
